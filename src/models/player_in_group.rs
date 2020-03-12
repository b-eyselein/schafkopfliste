use serde::Serialize;
use serde_tsi::prelude::*;

use crate::schema::player_in_groups;

use super::accumulated_result::AccumulatedResult;
use super::group::Group;
use super::player::Player;
use super::rule_set::RuleSet;

#[derive(Queryable, Insertable)]
pub struct PlayerInGroup {
    group_id: i32,
    player_id: i32,
    balance: i32,
    game_count: i32,
    put_count: i32,
    played_games: i32,
    win_count: i32,
    is_active: bool,
}

impl PlayerInGroup {
    pub fn new(group_id: i32, player_id: i32, is_active: bool) -> PlayerInGroup {
        PlayerInGroup {
            group_id,
            player_id,
            balance: 0,
            game_count: 0,
            put_count: 0,
            played_games: 0,
            win_count: 0,
            is_active,
        }
    }
}

#[derive(Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct PlayerWithGroupResult {
    pub player: Player,
    pub session_result: AccumulatedResult,
}

#[derive(Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct GroupWithPlayersAndRuleSet {
    pub id: i32,
    pub name: String,
    pub rule_set: RuleSet,
    pub players: Vec<PlayerWithGroupResult>,
}

#[derive(Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct PlayerAndMembership {
    pub player: Player,
    pub is_member: bool,
}

#[derive(Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct GroupWithPlayerMembership {
    pub group: Group,
    pub player_memberships: Vec<PlayerAndMembership>,
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![
        GroupWithPlayerMembership::ts_type(),
        GroupWithPlayersAndRuleSet::ts_type(),
    ]
}
