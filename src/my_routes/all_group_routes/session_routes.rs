use rocket::{get, put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwt;
use crate::models::complete_session::CompleteSession;
use crate::models::session::{select_session_by_id, CreatableSession, Session};
use crate::my_routes::routes_helpers::{on_db_error, on_json_error};
use crate::DbConn;

#[get("/<group_id>/sessions")]
fn route_get_sessions(conn: DbConn, group_id: i32) -> Json<Vec<Session>> {
    use crate::models::session::select_sessions_for_group;

    Json(select_sessions_for_group(&conn.0, &group_id))
}

#[get("/<group_id>/sessions/<serial_number>")]
fn route_get_session(conn: DbConn, group_id: i32, serial_number: i32) -> Json<Option<Session>> {
    Json(select_session_by_id(&conn.0, &group_id, &serial_number).ok())
}

#[get("/<group_id>/sessions/<serial_number>/sessionWithPlayersAndRuleSet")]
fn route_get_session_with_players_and_rule_set(
    conn: DbConn,
    group_id: i32,
    serial_number: i32,
) -> Json<Option<CompleteSession>> {
    use crate::models::complete_session::select_complete_session_by_id;

    Json(select_complete_session_by_id(
        &conn.0,
        &group_id,
        &serial_number,
    ))
}

#[put(
    "/<group_id>/sessions",
    format = "application/json",
    data = "<creatable_session_json>"
)]
fn route_create_session(
    my_jwt: MyJwt,
    conn: DbConn,
    group_id: i32,
    creatable_session_json: Result<Json<CreatableSession>, JsonError>,
) -> Result<Json<Session>, Json<String>> {
    use crate::models::session::insert_session;

    creatable_session_json
        .map_err(|err| on_json_error("Error while reading json", err))
        .and_then(|creatable_session| {
            insert_session(
                &conn.0,
                group_id,
                my_jwt.claims.username,
                creatable_session.0,
            )
            .map_err(|err2| on_db_error("Could not insert session into db", err2))
            .map(Json)
        })
}

#[put("/<group_id>/sessions/<session_id>", format = "application/json")]
fn route_end_session(
    _my_jwt: MyJwt,
    conn: DbConn,
    group_id: i32,
    session_id: i32,
) -> Result<Json<bool>, Json<String>> {
    use crate::models::session::update_end_session;

    println!("{} - {}", &group_id, &session_id);

    update_end_session(&conn.0, group_id, session_id)
        .map_err(|err| on_db_error("Could not update has_ended in db", err))
        .map(Json)
}

pub fn exported_routes() -> Vec<Route> {
    routes![
        route_get_sessions,
        route_get_session,
        route_get_session_with_players_and_rule_set,
        route_create_session,
        route_end_session
    ]
}
