use diesel::{self, prelude::*, result::Error as DbError, PgConnection};
use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::players;

#[derive(Debug, Deserialize, Insertable, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
#[table_name = "players"]
pub struct CreatablePlayer {
    pub abbreviation: String,
    pub name: String,
    pub picture_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct Player {
    pub id: i32,
    pub abbreviation: String,
    pub name: String,
    pub picture_name: Option<String>,
}

impl Player {
    pub fn new(id: i32, abbreviation: String, name: String) -> Player {
        Player {
            id,
            abbreviation,
            name,
            picture_name: None,
        }
    }
}

pub fn select_players(conn: &PgConnection) -> Vec<Player> {
    players::table.load(conn).unwrap_or(Vec::new())
}

pub fn select_player_by_id(conn: &PgConnection, id: &i32) -> Result<Player, DbError> {
    players::table.filter(players::id.eq(id)).first(conn)
}

pub fn get_players(conn: &PgConnection) -> Vec<Player> {
    players::table.load::<Player>(conn).unwrap_or(Vec::new())
}

pub fn insert_player(
    conn: &PgConnection,
    creatable_player: CreatablePlayer,
) -> Result<Player, DbError> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players)
        .values(&creatable_player)
        .returning(id)
        .get_result(conn)
        .map(|new_player_id| {
            Player::new(
                new_player_id,
                creatable_player.abbreviation,
                creatable_player.name,
            )
        })
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![CreatablePlayer::ts_type(), Player::ts_type()]
}
