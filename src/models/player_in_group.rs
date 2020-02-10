use diesel::{self, prelude::*, PgConnection};
use serde::Serialize;

use crate::models::game::{select_rule_set_by_id, RuleSet};
use crate::models::player::Player;
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
}

impl PlayerInGroup {
    pub fn new(group_id: i32, player_id: i32) -> PlayerInGroup {
        PlayerInGroup {
            group_id,
            player_id,
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

#[derive(Debug, Serialize)]
pub struct GroupWithPlayersAndRuleSet {
    id: i32,
    name: String,
    default_rule_set: Option<RuleSet>,
    players: Vec<Player>,
}

impl GroupWithPlayersAndRuleSet {
    pub fn new(
        id: i32,
        name: String,
        default_rule_set: Option<RuleSet>,
        players: Vec<Player>,
    ) -> GroupWithPlayersAndRuleSet {
        GroupWithPlayersAndRuleSet {
            id,
            name,
            default_rule_set,
            players,
        }
    }
}

pub fn select_groups_with_player_count(conn: &PgConnection) -> Vec<GroupWithPlayerCount> {
    groups_with_player_count::table
        .load::<GroupWithPlayerCount>(conn)
        .unwrap_or(Vec::new())
}

pub fn select_players_in_group(conn: &PgConnection, the_group_id: i32) -> Vec<Player> {
    use crate::schema::player_in_groups::dsl::*;
    use crate::schema::players::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .inner_join(players.on(player_id.eq(id)))
        .select((id, abbreviation, name))
        .load::<Player>(conn)
        .unwrap_or(Vec::new())
}

pub fn select_group_with_players_and_rule_set_by_id(
    conn: &PgConnection,
    the_group_id: i32,
) -> Option<GroupWithPlayersAndRuleSet> {
    use crate::models::group::get_group;

    get_group(conn, the_group_id).map(|g| {
        let default_rule_set = g
            .default_rule_set_id
            .and_then(|id| select_rule_set_by_id(conn, id));
        let players = select_players_in_group(conn, the_group_id);

        GroupWithPlayersAndRuleSet::new(g.id, g.name, default_rule_set, players)
    })
}

pub fn add_player_to_group(conn: &PgConnection, group_id: i32, player_id: i32) -> bool {
    let inserted_count = diesel::insert_into(player_in_groups::table)
        .values(PlayerInGroup::new(group_id, player_id))
        .execute(conn);

    match inserted_count {
        Ok(1) => true,
        _ => false,
    }
}

#[allow(dead_code)]
pub fn get_player_ids_in_group(conn: &PgConnection, the_group_id: i32) -> Vec<i32> {
    use crate::schema::player_in_groups::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .select(player_id)
        .load::<i32>(conn)
        .unwrap_or(Vec::new())
}
