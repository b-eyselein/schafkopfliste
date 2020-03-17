use diesel::{prelude::*, PgConnection, QueryResult};

use crate::models::session_result::SessionResult;

pub fn select_session_results(conn: &PgConnection) -> QueryResult<Vec<SessionResult>> {
    use crate::schema::session_results::dsl::*;

    session_results.load(conn)
}

pub fn select_session_result_for_player(
    conn: &PgConnection,
    the_group_id: &i32,
    the_session_id: &i32,
    player_id: &i32,
) -> QueryResult<SessionResult> {
    todo!("implement!")
}

pub fn select_session_results_for_session(
    conn: &PgConnection,
    the_session_id: i32,
    the_group_id: i32,
) -> QueryResult<Vec<SessionResult>> {
    use crate::schema::session_results::dsl::*;

    session_results
        .filter(group_id.eq(the_group_id))
        .filter(session_id.eq(the_session_id))
        .load::<SessionResult>(conn)
}

pub fn upsert_session_result(
    conn: &PgConnection,
    the_session_result: SessionResult,
) -> QueryResult<SessionResult> {
    //    use crate::schema::session_results::dsl::*;

    todo!("implement...")
    /*
    diesel::insert_into(session_results)
        .values(&the_session_result)
        .on_conflict((player_id, session_id, group_id))
        .do_update()
        .set(result.eq(the_session_result.result))
        .get_result(conn)
        */
}
