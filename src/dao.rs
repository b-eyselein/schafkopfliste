//use bcrypt::{DEFAULT_COST, hash, verify};
use bcrypt::verify;
use diesel::{self, prelude::*};

use crate::models::player::{Credentials, Group, Player, PlayerWithPassword};
use crate::DbConn;

pub fn authenticate_user(conn: DbConn, credentials: Credentials) -> bool {
    use crate::schema::player_with_passwords::dsl::*;

    let player_with_password = player_with_passwords
        .filter(username.eq(&credentials.username))
        .first::<PlayerWithPassword>(&conn.0);

    match player_with_password {
        Err(_) => false,
        Ok(pwp) => verify(credentials.password, &pwp.password_hash).unwrap_or(false),
    }
}

pub fn get_groups(conn: DbConn) -> Vec<Group> {
    use crate::schema::groups::dsl::*;

    groups.load::<Group>(&conn.0).unwrap_or_else(|e| {
        println!("Error while querying groups from database: {}", e);
        Vec::new()
    })
}

pub fn get_players(conn: DbConn) -> Vec<Player> {
    use crate::schema::player_with_passwords::dsl::*;

    player_with_passwords
        .load::<PlayerWithPassword>(&conn.0)
        .unwrap_or_else(|e| {
            println!("Error while querying players from database: {}", e);
            Vec::new()
        })
        .into_iter()
        .map(Player::from_player_with_password)
        .collect()
}
