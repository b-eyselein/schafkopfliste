use diesel::PgConnection;
use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;

use crate::schema::games;

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum)]
pub enum Suit {
    Acorns,
    Leaves,
    Hearts,
    Bells,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum)]
#[DieselType = "Schneider_schwarz"]
pub enum SchneiderSchwarz {
    Schneider,
    Schwarz,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum GameType {
    Ruf { suit: Suit },
    Wenz,
    Farbsolo { suit: Suit },
    Geier,
    Hochzeit,
    Bettel,
    Ramsch,
    Farbwenz { suit: Suit },
    Farbgeier { suit: Suit },
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Game {
    serial_number: i32,
    session_serial_number: i32,
    group_id: i32,
    game_type: GameType,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatableGame {
    game_type: GameType,
    laufende_count: i32,
}

#[derive(Debug, Queryable, Insertable)]
#[table_name = "games"]
struct InsertableGame {
    serial_number: i32,
    session_serial_number: i32,
    group_id: i32,
    game_type_json: JsonValue,
}

pub fn insert_game(
    conn: &PgConnection,
    group_id: i32,
    session_serial_number: i32,
    game: CreatableGame,
) -> Result<Game, String> {
    Err("Not yet implemented!".into())
}
