use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::schema::games;

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum)]
#[DieselType = "Bavarian_suit"]
pub enum BavarianSuit {
    Acorns,
    Leaves,
    Hearts,
    Bells,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum)]
#[DieselType = "Game_type"]
pub enum GameType {
    Ruf,
    Wenz,
    Farbsolo,
    Geier,
    Hochzeit,
    Bettel,
    Ramsch,
    Farbwenz,
    Farbgeier,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum)]
#[DieselType = "Schneider_schwarz"]
pub enum SchneiderSchwarz {
    Schneider,
    Schwarz,
}

#[derive(Debug, Serialize, Queryable, Insertable)]
#[serde(rename_all = "camelCase")]
pub struct Game {
    id: i32,
    session_id: i32,
    group_id: i32,
    game_type: GameType,
    suit: Option<BavarianSuit>,
    laufende_count: i32,
    schneider_schwarz: Option<SchneiderSchwarz>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatableGame {
    id: i32,
    game_type: GameType,
    suit: Option<BavarianSuit>,
    laufende_count: i32,
    schneider_schwarz: Option<SchneiderSchwarz>,
}

pub fn insert_game(
    _conn: &PgConnection,
    _group_id: i32,
    _session_serial_number: i32,
    _game: CreatableGame,
) -> Result<Game, String> {
    Err("Not yet implemented!".into())
}
