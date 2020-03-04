use rocket::{get, put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwtToken;
use crate::models::session::{
    insert_session, select_complete_session_by_id, select_session_by_id, select_sessions_for_group,
    CompleteSession, CreatableSession, Session,
};
use crate::DbConn;

#[get("/<group_id>/sessions")]
fn route_get_sessions(conn: DbConn, group_id: i32) -> Json<Vec<Session>> {
    Json(select_sessions_for_group(&conn.0, &group_id))
}

#[get("/<group_id>/sessions/<serial_number>")]
fn route_get_session(conn: DbConn, group_id: i32, serial_number: i32) -> Json<Option<Session>> {
    Json(select_session_by_id(&conn.0, &group_id, &serial_number))
}

#[get("/<group_id>/sessions/<serial_number>/sessionWithPlayersAndRuleSet")]
fn route_get_session_with_players_and_rule_set(
    conn: DbConn,
    group_id: i32,
    serial_number: i32,
) -> Json<Option<CompleteSession>> {
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
    my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    creatable_session_json: Result<Json<CreatableSession>, JsonError>,
) -> Result<Json<Session>, Json<String>> {
    creatable_session_json
        .map_err(|err| -> Json<String> {
            let base_error_msg = "Error while reading json";
            println!("{}: {:?}", base_error_msg, err);
            Json(base_error_msg.into())
        })
        .and_then(|creatable_session| {
            insert_session(
                &conn.0,
                group_id,
                my_jwt.claims.username,
                creatable_session.0,
            )
            .map_err(|err| -> Json<String> {
                println!("Could not insert session into db: {}", err);
                Json("".into())
            })
            .map(Json)
        })
}

pub fn exported_routes() -> Vec<Route> {
    routes![
        route_get_sessions,
        route_get_session,
        route_get_session_with_players_and_rule_set,
        route_create_session,
    ]
}
