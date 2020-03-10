use diesel::{self, prelude::*, result::Error as DbError, PgConnection};

use super::session::{CreatableSession, Session};

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
    the_group_id: &i32,
    the_id: &i32,
) -> Result<Session, DbError> {
    use crate::schema::sessions::dsl::*;

    sessions.find((the_id, the_group_id)).first(conn)
}

pub fn select_session_has_ended(
    conn: &PgConnection,
    the_group_id: &i32,
    the_id: &i32,
) -> Result<bool, DbError> {
    use crate::schema::sessions::dsl::*;

    sessions
        .find((the_id, the_group_id))
        .select(has_ended)
        .first(conn)
}

fn select_max_session_id(conn: &PgConnection, the_group_id: i32) -> Result<i32, DbError> {
    use crate::schema::sessions::dsl::*;
    use diesel::dsl::max;

    sessions
        .filter(group_id.eq(the_group_id))
        .select(max(id))
        .first::<Option<i32>>(conn)
        .map(|maybe_max| maybe_max.unwrap_or(0))
}

pub fn insert_session(
    conn: &PgConnection,
    the_group_id: i32,
    the_creator_username: String,
    cs: CreatableSession,
) -> Result<Session, DbError> {
    use crate::schema::sessions;

    let new_id = select_max_session_id(conn, the_group_id)? + 1;

    let session = Session::from_creatable_session(new_id, the_group_id, the_creator_username, cs);

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

    let source = sessions
        .filter(group_id.eq(the_group_id))
        .filter(id.eq(the_session_id));

    diesel::update(source)
        .set(has_ended.eq(true))
        .returning(has_ended)
        .get_result(conn)
}
