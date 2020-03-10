use rocket::{get, put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use super::super::routes_helpers::{on_error, MyJsonResponse};
use crate::jwt_helpers::MyJwt;
use crate::models::complete_session::{
    analyze_session, select_complete_session_by_id, CompleteSession,
};
use crate::models::player_in_group_dao::update_player_group_result;
use crate::models::session::{CreatableSession, Session};
use crate::models::session_dao::select_session_by_id;
use crate::DbConn;

#[get("/<group_id>/sessions")]
fn route_get_sessions(conn: DbConn, group_id: i32) -> Json<Vec<Session>> {
    use crate::models::session_dao::select_sessions_for_group;

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

    Json(select_complete_session_by_id(&conn.0, &group_id, &serial_number).ok())
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
) -> MyJsonResponse<Session> {
    use crate::models::session_dao::insert_session;

    creatable_session_json
        .map_err(|err| on_error("Error while reading json", err))
        .and_then(|creatable_session| {
            insert_session(
                &conn.0,
                group_id,
                my_jwt.claims.user.username,
                creatable_session.0,
            )
            .map_err(|err2| on_error("Could not insert session into db", err2))
            .map(Json)
        })
}

#[put("/<group_id>/sessions/<session_id>", format = "application/json")]
fn route_end_session(
    _my_jwt: MyJwt,
    db_conn: DbConn,
    group_id: i32,
    session_id: i32,
) -> MyJsonResponse<bool> {
    use crate::models::session_dao::update_end_session;
    use diesel::Connection;

    let conn = db_conn.0;

    let complete_session: CompleteSession =
        select_complete_session_by_id(&conn, &group_id, &session_id)
            .map_err(|err| on_error("Could not read complete session from db", err))?;

    let session_analysis_result =
        analyze_session(complete_session.players(), complete_session.played_games());

    conn.transaction::<bool, diesel::result::Error, _>(|| {
        for (player_id, session_result) in session_analysis_result {
            update_player_group_result(&conn, player_id, &session_result).map(|_| ())?
        }

        update_end_session(&conn, group_id, session_id)
    })
    .map_err(|err: diesel::result::Error| on_error("Could not update has_ended in db", err))
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
