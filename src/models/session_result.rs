use diesel::{self, prelude::*, result::QueryResult, PgConnection};
use serde::Serialize;

use crate::schema::session_results;

#[derive(Debug, Insertable, Queryable, Serialize)]
pub struct SessionResult {
    player_abbreviation: String,
    session_id: i32,
    group_name: String,
    result: i32,
}

pub fn select_session_results(conn: &PgConnection) -> QueryResult<Vec<SessionResult>> {
    session_results::table.load(conn)
}

pub fn select_session_results_for_session(
    conn: &PgConnection,
    the_session_id: i32,
    the_group_name: &str,
) -> QueryResult<Vec<SessionResult>> {
    use crate::schema::session_results::dsl::*;

    session_results
        .filter(group_name.eq(the_group_name))
        .filter(session_id.eq(the_session_id))
        .load(conn)
}

pub fn upsert_session_result(
    conn: &PgConnection,
    the_session_result: SessionResult,
) -> QueryResult<SessionResult> {
    use crate::schema::session_results::dsl::*;

    diesel::insert_into(session_results)
        .values(&the_session_result)
        .on_conflict((player_abbreviation, session_id, group_name))
        .do_update()
        .set(result.eq(the_session_result.result))
        .get_result(conn)
}
