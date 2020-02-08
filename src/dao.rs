use diesel::{self, prelude::*};

use crate::DbConn;
use crate::models::player::{CreatablePlayer, Group, Player};
use crate::models::user::User;

pub fn user_by_username(conn: DbConn, name: &String) -> Option<User> {
    use crate::schema::users::dsl::*;

    users.filter(username.eq(&name)).first::<User>(&conn.0).ok()
}

pub fn get_groups(conn: DbConn) -> Vec<Group> {
    use crate::schema::groups::dsl::*;

    groups.load::<Group>(&conn.0).unwrap_or_else(|e| {
        println!("Error while querying groups from database: {}", e);
        Vec::new()
    })
}

pub fn get_players(conn: DbConn) -> Vec<Player> {
    use crate::schema::players::dsl::*;

    players.load::<Player>(&conn.0).unwrap_or_else(|e| {
        println!("Error while querying players from database: {}", e);
        Vec::new()
    })
}

pub fn insert_player(conn: DbConn, player: &CreatablePlayer) -> Result<i32, String> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players)
        .values(player)
        .returning(id)
        .get_result(&conn.0)
        .map_err(|_| {
            format!(
                "Error inserting player with abbreviation {} into db",
                &player.abbreviation
            )
        })
}
