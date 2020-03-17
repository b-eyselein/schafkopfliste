use serde::Serialize;
use serde_tsi::prelude::*;

use crate::schema::session_results;

use super::accumulated_result::AccumulatedResult;

#[derive(Debug, Queryable, Serialize, HasTypescriptType)]
pub struct SessionResult {
    pub player_id: i32,
    pub session_id: i32,
    pub group_id: i32,

    #[diesel(embed)]
    pub result: AccumulatedResult,
}
