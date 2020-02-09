use diesel;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::schema::players;
use crate::DbConn;

#[derive(Debug, Deserialize, Insertable)]
#[table_name = "players"]
pub struct CreatablePlayer {
    pub abbreviation: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Queryable)]
pub struct Player {
    pub id: i32,
    pub abbreviation: String,
    pub name: String,
}

impl Player {
    pub fn new(id: i32, abbreviation: String, name: String) -> Player {
        Player {
            id,
            abbreviation,
            name,
        }
    }
}

pub fn get_players(conn: DbConn) -> Vec<Player> {
    use crate::schema::players::dsl::*;

    players.load::<Player>(&conn.0).unwrap_or_else(|e| {
        println!("Error while querying players from database: {}", e);
        Vec::new()
    })
}

pub fn insert_player(conn: DbConn, player: CreatablePlayer) -> Result<Player, String> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players)
        .values(&player)
        .returning(id)
        .get_result(&conn.0)
        .map_err(|_| {
            format!(
                "Error inserting player with abbreviation {} into db",
                &player.abbreviation
            )
        })
        .map(|new_player_id| Player::new(new_player_id, player.abbreviation, player.name))
}
