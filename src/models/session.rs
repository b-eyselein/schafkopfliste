use chrono::NaiveDate;
use diesel::{self, prelude::*, PgConnection};
use serde::{Deserialize, Serialize};

use crate::schema::sessions;

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

#[derive(Debug, Serialize, Queryable, Insertable)]
#[serde(rename_all = "camelCase")]
pub struct Session {
    serial_number: i32,
    group_id: i32,
    date: NaiveDate,
    first_player_id: i32,
    second_player_id: i32,
    third_player_id: i32,
    fourth_player_id: i32,
    rule_set_id: i32,
}

impl Session {
    fn from_creatable_session(serial_number: i32, group_id: i32, cs: CreatableSession) -> Session {
        let CreatableSession {
            date,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
            rule_set_id,
        } = cs;

        Session {
            serial_number,
            group_id,
            date,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
            rule_set_id,
        }
    }
}

pub fn insert_session(
    conn: &PgConnection,
    group_id: i32,
    cs: CreatableSession,
) -> Result<Session, String> {
    let maybe_max_serial_number = sessions::table
        .filter(sessions::group_id.eq(group_id))
        .select(diesel::dsl::max(sessions::serial_number))
        .first::<Option<i32>>(conn)
        .map_err(|_| -> String { "Error while querying serial for new session".into() })?;

    let serial_number = maybe_max_serial_number.map(|v| v + 1).unwrap_or(0);

    diesel::insert_into(sessions::table)
        .values(Session::from_creatable_session(serial_number, group_id, cs))
        .returning(sessions::all_columns)
        .get_result(conn)
        .map_err(|_| "Error while inserting session into db".into())
}
