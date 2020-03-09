use serde_tsi::prelude::*;

pub fn write_all_ts_types() {
    // TODO: Write ts types only in dev mode or while build!
    println!("Writing ts types...");

    let top_tier_types: Vec<TsType> = [
        vec![
            crate::models::rule_set::RuleSet::ts_type(),
            crate::models::game::PricedGame::ts_type(),
            crate::models::complete_session::CompleteSession::ts_type(),
        ],
        crate::models::group::exported_ts_types(),
        crate::models::player::exported_ts_types(),
        crate::models::player_in_group::exported_ts_types(),
        crate::models::session::exported_ts_types(),
        crate::models::user::exported_ts_types(),
    ]
    .concat();

    write_ts_types("./ui/src/app/_interfaces/interfaces.ts", top_tier_types, "");
}
