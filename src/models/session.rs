use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::sessions;

use super::group::Group;

#[derive(Debug, Serialize, Deserialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct CreatableSession {
    date_year: i32,
    date_month: i32,
    date_day_of_month: i32,
    time_hours: i32,
    time_minutes: i32,

    first_player_id: i32,
    second_player_id: i32,
    third_player_id: i32,
    fourth_player_id: i32,
}

#[derive(
    Debug,
    Deserialize,
    Serialize,
    Identifiable,
    Queryable,
    Insertable,
    Associations,
    PartialEq,
    HasTypescriptType,
)]
#[serde(rename_all = "camelCase")]
#[belongs_to(Group)]
pub struct Session {
    pub id: i32,
    pub group_id: i32,

    pub date_year: i32,
    pub date_month: i32,
    pub date_day_of_month: i32,
    pub time_hours: i32,
    pub time_minutes: i32,

    pub has_ended: bool,

    pub first_player_id: i32,
    pub second_player_id: i32,
    pub third_player_id: i32,
    pub fourth_player_id: i32,

    pub creator_username: String,
}

impl Session {
    pub fn from_creatable_session(
        id: i32,
        group_id: i32,
        creator_username: String,
        cs: CreatableSession,
    ) -> Session {
        let CreatableSession {
            date_year,
            date_month,
            date_day_of_month,
            time_hours,
            time_minutes,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
        } = cs;

        Session {
            id,
            group_id,
            date_year,
            date_month,
            date_day_of_month,
            time_hours,
            time_minutes,
            has_ended: false,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
            creator_username,
        }
    }
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![CreatableSession::ts_type(), Session::ts_type()]
}
