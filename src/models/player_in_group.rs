use diesel::{self, prelude::*, result::Error as DbError, PgConnection};
use serde::Serialize;
use serde_tsi::prelude::*;

use crate::models::complete_session::SessionResult;
use crate::models::group::{select_group_by_id, Group};
use crate::models::player::{select_players, Player};
use crate::models::rule_set::{select_rule_set_by_id, RuleSet};
use crate::schema::player_in_groups;

table! {
    groups_with_player_count (id) {
        id -> Int4,
        name -> Varchar,
        default_rule_set_id -> Nullable<Int4>,
        player_count -> BigInt,
    }
}

#[derive(Debug, Queryable, Insertable)]
pub struct PlayerInGroup {
    group_id: i32,
    player_id: i32,
    balance: i32,
    game_count: i32,
    put_count: i32,
    played_games: i32,
    win_count: i32,
    is_active: bool,
}

impl PlayerInGroup {
    pub fn new(group_id: i32, player_id: i32, is_active: bool) -> PlayerInGroup {
        PlayerInGroup {
            group_id,
            player_id,
            balance: 0,
            game_count: 0,
            put_count: 0,
            played_games: 0,
            win_count: 0,
            is_active,
        }
    }
}

#[derive(Debug, Serialize, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct GroupWithPlayerCount {
    id: i32,
    name: String,
    default_rule_set_id: Option<i32>,
    player_count: i64,
}

#[derive(Debug, Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct PlayerWithGroupResult {
    pub player: Player,
    pub session_result: SessionResult,
}

#[derive(Debug, Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct GroupWithPlayersAndRuleSet {
    pub id: i32,
    pub name: String,
    pub default_rule_set: Option<RuleSet>,
    pub players: Vec<PlayerWithGroupResult>,
}

#[derive(Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct PlayerAndMembership {
    player: Player,
    is_member: bool,
}

#[derive(Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct GroupWithPlayerMembership {
    group: Group,
    player_memberships: Vec<PlayerAndMembership>,
}

pub fn select_groups_with_player_count(conn: &PgConnection) -> Vec<GroupWithPlayerCount> {
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
        .select((id, abbreviation, name))
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
            (id, abbreviation, name),
            (balance, game_count, put_count, played_games, win_count),
        ))
        .load::<(Player, SessionResult)>(conn)
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
    select_group_by_id(conn, the_group_id).map(|g| {
        let default_rule_set = g
            .default_rule_set_id
            .and_then(|id| select_rule_set_by_id(conn, &id).ok());

        GroupWithPlayersAndRuleSet {
            id: g.id,
            name: g.name,
            default_rule_set,
            players: select_players_in_group_with_group_result(conn, the_group_id),
        }
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
    res: &SessionResult,
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
