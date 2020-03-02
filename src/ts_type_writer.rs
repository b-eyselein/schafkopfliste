use serde_tsi::prelude::*;

pub fn write_all_ts_types() {
    // TODO: Write ts types only in dev mode or while build!
    println!("Writing ts types...");

    let top_tier_types: Vec<TsType> = vec![
        crate::models::user::Credentials::ts_type(),
        crate::models::user::UserWithToken::ts_type(),
        crate::models::player::CreatablePlayer::ts_type(),
        crate::models::player::Player::ts_type(),
        crate::models::rule_set::RuleSet::ts_type(),
        crate::models::group::CreatableGroup::ts_type(),
        crate::models::group::Group::ts_type(),
    ];

    write_ts_types("./ui/src/app/_interfaces/interfaces.ts", top_tier_types);
}
