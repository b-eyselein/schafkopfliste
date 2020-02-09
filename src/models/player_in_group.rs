use diesel;
use diesel::prelude::*;
use serde::Serialize;

use crate::models::player::Player;
use crate::schema::player_in_groups;
use crate::DbConn;

table! {
    groups_with_player_count (id) {
        id -> Int4,
        name -> Varchar,
        player_count -> BigInt,
    }
}

#[derive(Debug, Queryable, Insertable)]
pub struct PlayerInGroup {
    pub group_id: i32,
    pub player_id: i32,
}

#[derive(Debug, Serialize, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct GroupWithPlayerCount {
    id: i32,
    name: String,
    player_count: i64,
}

pub fn get_groups_with_player_count(conn: DbConn) -> Vec<GroupWithPlayerCount> {
    use crate::models::player_in_group::groups_with_player_count::dsl::*;

    groups_with_player_count
        .load::<GroupWithPlayerCount>(&conn.0)
        .unwrap_or(Vec::new())
}

pub fn get_players_in_group(conn: DbConn, the_group_id: i32) -> Vec<Player> {
    use crate::schema::player_in_groups::dsl::*;
    use crate::schema::players::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .inner_join(players.on(player_id.eq(id)))
        .select((id, abbreviation, name))
        .load::<Player>(&conn.0)
        .unwrap_or(Vec::new())
}

#[allow(dead_code)]
pub fn get_player_ids_in_group(conn: DbConn, the_group_id: i32) -> Vec<i32> {
    use crate::schema::player_in_groups::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .select(player_id)
        .load::<i32>(&conn.0)
        .unwrap_or(Vec::new())
}
