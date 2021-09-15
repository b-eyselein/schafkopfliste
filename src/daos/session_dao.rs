use diesel::{prelude::*, PgConnection, QueryResult};

use crate::models::session::Session;

pub fn select_sessions_for_group(conn: &PgConnection, the_group_name: &str) -> QueryResult<Vec<Session>> {
    use crate::schema::sessions::dsl::*;

    sessions.filter(group_name.eq(the_group_name)).order_by(id).load(conn)
}

pub fn select_session_by_id(conn: &PgConnection, the_group_name: &str, the_id: &i32) -> QueryResult<Option<Session>> {
    use crate::schema::sessions::dsl::*;

    sessions.find((the_id, the_group_name)).first(conn).optional()
}

pub fn select_session_has_ended(conn: &PgConnection, the_group_name: &str, the_id: &i32) -> QueryResult<bool> {
    use crate::schema::sessions::dsl::*;

    sessions.find((the_id, the_group_name)).select(has_ended).first(conn)
}

pub fn update_end_session(conn: &PgConnection, the_group_name: &str, the_session_id: i32) -> QueryResult<bool> {
    use crate::schema::sessions::dsl::*;

    let source = sessions.filter(group_name.eq(the_group_name)).filter(id.eq(the_session_id));

    diesel::update(source).set(has_ended.eq(true)).returning(has_ended).get_result(conn)
}
