use rocket::Route;
use rocket_contrib::json::Json;

use crate::jwt_helpers::MyJwtToken;
use crate::models::session::{insert_session, CreatableSession, Session};
use crate::DbConn;

#[put(
    "/groups/<group_id>/sessions",
    format = "application/json",
    data = "<creatable_session_json>"
)]
fn create_session(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    creatable_session_json: Json<CreatableSession>,
) -> Result<Json<Session>, String> {
    insert_session(&conn.0, group_id, creatable_session_json.0).map(Json)
}

pub fn exported_routes() -> Vec<Route> {
    routes![create_session]
}
