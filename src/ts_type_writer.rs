use crate::models;
use serde_tsi::prelude::*;

pub fn write_all_ts_types() {
    // TODO: Write ts types only in dev mode or while build!
    println!("Writing ts types...");

    let top_tier_types: Vec<TsType> = [
        vec![
            models::rule_set::RuleSet::ts_type(),
            models::game::PricedGame::ts_type(),
            models::group_with_player_count::GroupWithPlayerCount::ts_type(),
            models::complete_session::CompleteSession::ts_type(),
        ],
        models::group::exported_ts_types(),
        models::player::exported_ts_types(),
        models::player_in_group::exported_ts_types(),
        models::session::exported_ts_types(),
        models::user::exported_ts_types(),
    ]
    .concat();

    write_ts_types("./ui/src/app/_interfaces/interfaces.ts", top_tier_types, "");
}
