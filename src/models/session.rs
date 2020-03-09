use diesel::{self, prelude::*, result::Error as DbError, PgConnection};
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
    rule_set_id: i32,
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
    pub rule_set_id: i32,

    pub creator_username: String,
}

impl Session {
    fn from_creatable_session(
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
            rule_set_id,
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
            rule_set_id,
            creator_username,
        }
    }

    pub fn rule_set_id(&self) -> &i32 {
        &self.rule_set_id
    }
}

pub fn select_sessions_for_group(conn: &PgConnection, the_group_id: &i32) -> Vec<Session> {
    use crate::schema::sessions::dsl::*;

    sessions
        .filter(group_id.eq(the_group_id))
        .order_by(id)
        .load(conn)
        .unwrap_or(Vec::new())
}

pub fn select_session_by_id(
    conn: &PgConnection,
    group_id: &i32,
    id: &i32,
) -> Result<Session, DbError> {
    sessions::table.find((id, group_id)).first(conn)
}

pub fn insert_session(
    conn: &PgConnection,
    group_id: i32,
    creator_username: String,
    cs: CreatableSession,
) -> Result<Session, DbError> {
    let maybe_max_id = sessions::table
        .filter(sessions::group_id.eq(group_id))
        .select(diesel::dsl::max(sessions::id))
        .first::<Option<i32>>(conn)?;

    let id = maybe_max_id.map(|v| v + 1).unwrap_or(1);

    let session = Session::from_creatable_session(id, group_id, creator_username, cs);

    diesel::insert_into(sessions::table)
        .values(session)
        .returning(sessions::all_columns)
        .get_result(conn)
}

pub fn update_end_session(
    conn: &PgConnection,
    the_group_id: i32,
    the_session_id: i32,
) -> Result<bool, DbError> {
    use crate::schema::sessions::dsl::*;

    let filter = group_id.eq(the_group_id).and(id.eq(the_session_id));

    diesel::update(sessions.filter(filter))
        .set(has_ended.eq(true))
        .returning(has_ended)
        .get_result(conn)
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![CreatableSession::ts_type(), Session::ts_type()]
}
