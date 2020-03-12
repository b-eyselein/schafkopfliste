use serde::Serialize;
use serde_tsi::prelude::*;

#[derive(Debug, Queryable, Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct AccumulatedResult {
    pub balance: i32,
    pub game_count: i32,
    pub put_count: i32,
    pub played_games: i32,
    pub win_count: i32,
}
