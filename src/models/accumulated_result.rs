use diesel::sql_types::Integer;
use serde::Serialize;
use serde_tsi::prelude::*;

#[derive(Debug, QueryableByName, Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct AccumulatedResult {
    #[sql_type = "Integer"]
    pub balance: i32,

    #[sql_type = "Integer"]
    pub game_count: i32,

    #[sql_type = "Integer"]
    pub put_count: i32,

    #[sql_type = "Integer"]
    pub played_games: i32,

    #[sql_type = "Integer"]
    pub win_count: i32,
}

impl AccumulatedResult {
    pub fn new() -> AccumulatedResult {
        AccumulatedResult {
            balance: 0,
            game_count: 0,
            put_count: 0,
            played_games: 0,
            win_count: 0,
        }
    }
}
