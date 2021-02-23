use diesel::sql_types::{BigInt, Integer, Varchar};
use serde::Serialize;

#[derive(Serialize, QueryableByName)]
#[serde(rename_all = "camelCase")]
pub struct GroupWithPlayerCount {
    #[sql_type = "Integer"]
    id: i32,
    #[sql_type = "Varchar"]
    name: String,
    #[sql_type = "Integer"]
    rule_set_id: i32,
    #[sql_type = "BigInt"]
    player_count: i64,
}
