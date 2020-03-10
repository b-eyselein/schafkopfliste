use diesel::{self, prelude::*, result::Error as DbError, PgConnection};

use super::accumulated_result::AccumulatedResult;
use super::group::Group;
use super::group_dao::select_group_by_id;
use super::player::{select_players, Player};
use super::player_in_group::{
    groups_with_player_count, GroupWithPlayerCount, GroupWithPlayerMembership,
    GroupWithPlayersAndRuleSet, PlayerAndMembership, PlayerInGroup, PlayerWithGroupResult,
};
use super::rule_set::select_rule_set_by_id;

pub fn select_groups_with_player_count(conn: &PgConnection) -> Vec<GroupWithPlayerCount> {
    use crate::schema::groups::dsl::*;
    use crate::schema::player_in_groups::dsl::*;

    let y = groups.left_outer_join(player_in_groups);

    groups_with_player_count::table
        .load::<GroupWithPlayerCount>(conn)
        .unwrap_or(Vec::new())
}

pub fn select_players_in_group(conn: &PgConnection, the_group_id: &i32) -> Vec<Player> {
    use crate::schema::player_in_groups::dsl::*;
    use crate::schema::players::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .filter(is_active.eq(true))
        .inner_join(players)
        .select((id, abbreviation, name, picture_name))
        .load::<Player>(conn)
        .unwrap_or(Vec::new())
}

pub fn select_players_in_group_with_group_result(
    conn: &PgConnection,
    the_group_id: &i32,
) -> Vec<PlayerWithGroupResult> {
    use crate::schema::player_in_groups::dsl::*;
    use crate::schema::players::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .inner_join(players)
        .select((
            (id, abbreviation, name, picture_name),
            (balance, game_count, put_count, played_games, win_count),
        ))
        .load::<(Player, AccumulatedResult)>(conn)
        .unwrap_or(Vec::new())
        .into_iter()
        .map(|(player, session_result)| PlayerWithGroupResult {
            player,
            session_result,
        })
        .collect()
}

pub fn select_group_with_players_and_rule_set_by_id(
    conn: &PgConnection,
    the_group_id: &i32,
) -> Result<GroupWithPlayersAndRuleSet, DbError> {
    let group = select_group_by_id(conn, the_group_id)?;

    Ok(GroupWithPlayersAndRuleSet {
        id: group.id,
        name: group.name,
        rule_set: select_rule_set_by_id(conn, &group.id)?,
        players: select_players_in_group_with_group_result(conn, the_group_id),
    })
}

pub fn toggle_group_membership(
    conn: &PgConnection,
    the_group_id: i32,
    the_player_id: i32,
    new_state: bool,
) -> Result<bool, DbError> {
    use crate::schema::player_in_groups::dsl::*;

    diesel::insert_into(player_in_groups)
        .values(PlayerInGroup::new(the_group_id, the_player_id, new_state))
        .on_conflict((player_id, group_id))
        .do_update()
        .set(is_active.eq(new_state))
        .returning(is_active)
        .get_result(conn)
}

#[allow(dead_code)]
pub fn select_groups_for_player(
    conn: &PgConnection,
    the_player_id: &i32,
) -> Vec<(PlayerInGroup, Group)> {
    use crate::schema::groups;
    use crate::schema::player_in_groups::dsl::*;

    player_in_groups
        .filter(player_id.eq(the_player_id))
        .inner_join(groups::table)
        .load::<(PlayerInGroup, Group)>(conn)
        .unwrap_or(Vec::new())
}

pub fn select_players_and_group_membership(
    conn: &PgConnection,
    the_group_id: &i32,
) -> Result<GroupWithPlayerMembership, DbError> {
    use crate::schema::player_in_groups::dsl::*;

    let group = select_group_by_id(&conn, &the_group_id)?;

    let player_ids_in_group: Vec<i32> = player_in_groups
        .filter(group_id.eq(the_group_id))
        .filter(is_active.eq(true))
        .select(player_id)
        .load(conn)
        .unwrap_or(Vec::new());

    let player_memberships = select_players(conn)
        .into_iter()
        .map(|p| {
            let is_in_group = player_ids_in_group.contains(&p.id);
            PlayerAndMembership {
                player: p,
                is_member: is_in_group,
            }
        })
        .collect();

    Ok(GroupWithPlayerMembership {
        group,
        player_memberships,
    })
}

pub fn update_player_group_result(
    conn: &PgConnection,
    the_player_id: i32,
    res: &AccumulatedResult,
) -> Result<PlayerInGroup, DbError> {
    use crate::schema::player_in_groups::dsl::*;

    diesel::update(player_in_groups)
        .filter(player_id.eq(the_player_id))
        .set((
            balance.eq(balance + &res.balance),
            game_count.eq(game_count + &res.game_count),
            put_count.eq(put_count + &res.put_count),
            played_games.eq(played_games + &res.played_games),
            win_count.eq(win_count + &res.win_count),
        ))
        .get_result(conn)
}
