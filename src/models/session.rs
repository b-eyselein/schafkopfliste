use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

use crate::schema::sessions;

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable)]
pub struct Session {
    uuid: String,
    date: NaiveDate,
    first_player_id: i32,
    second_player_id: i32,
    third_player_id: i32,
    fourth_player_id: i32,
}

impl Session {
    pub fn new(
        uuid: String,
        date: NaiveDate,
        first_player_id: i32,
        second_player_id: i32,
        third_player_id: i32,
        fourth_player_id: i32,
    ) -> Session {
        Session {
            uuid,
            date,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
        }
    }

    pub fn from_creatable_session(
        uuid: String,
        cs: CreatableSession,
    ) -> (Session, Vec</*AllowedGameTypeInSession*/ i32>) {
        let session = Session::new(
            uuid,
            cs.date,
            cs.first_player_id,
            cs.second_player_id,
            cs.third_player_id,
            cs.fourth_player_id,
        );

        (session, Vec::new())
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatableSession {
    pub date: NaiveDate,
    pub first_player_id: i32,
    pub second_player_id: i32,
    pub third_player_id: i32,
    pub fourth_player_id: i32,
    pub rule_set_id: i32,
}
