use diesel;
use diesel::prelude::*;

use crate::schema::player_in_groups;
use crate::DbConn;

#[derive(Debug, Queryable, Insertable)]
pub struct PlayerInGroup {
    pub group_id: i32,
    pub player_id: i32,
}

pub fn get_player_count_in_group(conn: DbConn, the_group_id: i32) -> i64 {
    use crate::schema::player_in_groups::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .count()
        .first(&conn.0)
        .unwrap_or(0)
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
