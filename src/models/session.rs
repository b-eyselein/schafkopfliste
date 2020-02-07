use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

use crate::schema::sessions;

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable)]
pub struct Session {
    uuid: String,
    date: NaiveDate,
    first_player_username: String,
    second_player_username: String,
    third_player_username: String,
    fourth_player_username: String,
}

impl Session {
    pub fn new(
        uuid: String,
        date: NaiveDate,
        first_player_username: String,
        second_player_username: String,
        third_player_username: String,
        fourth_player_username: String,
    ) -> Session {
        Session {
            uuid,
            date,
            first_player_username,
            second_player_username,
            third_player_username,
            fourth_player_username,
        }
    }

    pub fn from_creatable_session(
        uuid: String,
        cs: CreatableSession,
    ) -> (Session, Vec</*AllowedGameTypeInSession*/ i32>) {
        let session = Session::new(
            uuid,
            cs.date,
            cs.first_player_username,
            cs.second_player_username,
            cs.third_player_username,
            cs.fourth_player_username,
        );

        let allowed_game_types = cs
            .allowed_game_type_ids
            /*
            .iter()
            .map(|gt| AllowedGameTypeInSession::new(uuid.clone(), gt.to_owned()))
            .collect()
            */;

        (session, allowed_game_types)
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatableSession {
    pub date: NaiveDate,
    pub first_player_username: String,
    pub second_player_username: String,
    pub third_player_username: String,
    pub fourth_player_username: String,
    pub allowed_game_type_ids: Vec<i32>,
}

/*
#[derive(Debug, Queryable, Insertable)]
pub struct AllowedGameTypeInSession {
    pub session_uuid: String,
    pub game_type_id: i32,
}

impl AllowedGameTypeInSession {
    pub fn new(session_uuid: String, game_type_id: i32) -> AllowedGameTypeInSession {
        AllowedGameTypeInSession {
            session_uuid,
            game_type_id,
        }
    }
}
*/
