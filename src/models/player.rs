use diesel::{self, prelude::*, PgConnection};
use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::players;

#[derive(Debug, Deserialize, Insertable, HasTypescriptType)]
#[table_name = "players"]
pub struct CreatablePlayer {
    pub abbreviation: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable, HasTypescriptType)]
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

pub fn select_players(conn: &PgConnection) -> Vec<Player> {
    players::table.load(conn).unwrap_or(Vec::new())
}

pub fn select_player_by_id(conn: &PgConnection, id: &i32) -> Option<Player> {
    players::table.filter(players::id.eq(id)).first(conn).ok()
}

pub fn get_players(conn: &PgConnection) -> Vec<Player> {
    players::table.load::<Player>(conn).unwrap_or(Vec::new())
}

pub fn insert_player(
    conn: &PgConnection,
    creatable_player: CreatablePlayer,
) -> Result<Player, String> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players)
        .values(&creatable_player)
        .returning(id)
        .get_result(conn)
        .map_err(|err| {
            println!("could not insert player into db: {}", err);
            format!(
                "Error inserting player with abbreviation {} into db",
                &creatable_player.abbreviation
            )
        })
        .map(|new_player_id| {
            Player::new(
                new_player_id,
                creatable_player.abbreviation,
                creatable_player.name,
            )
        })
}
