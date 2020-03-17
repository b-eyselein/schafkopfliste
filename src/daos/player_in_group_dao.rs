use diesel::expression::dsl::count_star;
use diesel::{prelude::*, sql_query, PgConnection, QueryResult};

use crate::models::accumulated_result::AccumulatedResult;
use crate::models::group::Group;
use crate::models::group_with_player_count::GroupWithPlayerCount;
use crate::models::player::Player;
use crate::models::player_in_group::{
    GroupWithPlayerMembership, GroupWithPlayersAndRuleSet, PlayerAndMembership, PlayerInGroup,
    PlayerWithGroupResult,
};

use super::group_dao::select_group_by_id;

pub fn select_player_count_for_group(conn: &PgConnection, the_group_id: i32) -> QueryResult<i32> {
    use crate::schema::player_in_groups::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .select(count_star())
        .first(conn)
        .map(|x: i64| x as i32)
}

pub fn select_groups_with_player_count(
    conn: &PgConnection,
) -> QueryResult<Vec<GroupWithPlayerCount>> {
    sql_query(include_str!(
        "../../complex_sql_queries/groups_with_player_count.sql"
    ))
    .load::<GroupWithPlayerCount>(conn)
}

pub fn select_players_in_group(
    conn: &PgConnection,
    the_group_id: &i32,
) -> QueryResult<Vec<Player>> {
    use crate::schema::player_in_groups::dsl::*;
    use crate::schema::players::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .filter(is_active.eq(true))
        .inner_join(players)
        .select((id, abbreviation, name, picture_name))
        .load::<Player>(conn)
}

pub fn select_players_in_group_with_group_result(
    conn: &PgConnection,
    the_group_id: &i32,
) -> QueryResult<Vec<PlayerWithGroupResult>> {
    use crate::schema::player_in_groups::dsl::*;
    use crate::schema::players::dsl::*;

    let players_in_group_with_results = player_in_groups
        .filter(group_id.eq(the_group_id))
        .inner_join(players)
        .select((
            (id, abbreviation, name, picture_name),
            (balance, game_count, put_count, played_games, win_count),
        ))
        .load::<(Player, AccumulatedResult)>(conn)?;

    Ok(players_in_group_with_results
        .into_iter()
        .map(|(player, session_result)| PlayerWithGroupResult {
            player,
            session_result,
        })
        .collect())
}

pub fn select_group_with_players_and_rule_set_by_id(
    conn: &PgConnection,
    the_group_id: &i32,
) -> QueryResult<GroupWithPlayersAndRuleSet> {
    use crate::models::rule_set::select_rule_set_by_id;

    let group = select_group_by_id(conn, the_group_id)?;

    Ok(GroupWithPlayersAndRuleSet {
        id: group.id,
        name: group.name,
        rule_set: select_rule_set_by_id(conn, &group.id)?,
        players: select_players_in_group_with_group_result(conn, the_group_id)?,
    })
}

pub fn toggle_group_membership(
    conn: &PgConnection,
    the_group_id: i32,
    the_player_id: i32,
    new_state: bool,
) -> QueryResult<bool> {
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
) -> QueryResult<Vec<(PlayerInGroup, Group)>> {
    use crate::schema::groups;
    use crate::schema::player_in_groups::dsl::*;

    player_in_groups
        .filter(player_id.eq(the_player_id))
        .inner_join(groups::table)
        .load::<(PlayerInGroup, Group)>(conn)
}

pub fn select_players_and_group_membership(
    conn: &PgConnection,
    the_group_id: &i32,
) -> QueryResult<GroupWithPlayerMembership> {
    use super::player_dao::select_players;
    use crate::schema::player_in_groups::dsl::*;

    let group = select_group_by_id(&conn, &the_group_id)?;

    let player_ids_in_group: Vec<i32> = player_in_groups
        .filter(group_id.eq(the_group_id))
        .filter(is_active.eq(true))
        .select(player_id)
        .load(conn)?;

    let player_memberships = select_players(conn)?
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
) -> QueryResult<PlayerInGroup> {
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
