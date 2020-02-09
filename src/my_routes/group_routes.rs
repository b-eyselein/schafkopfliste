use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwtToken;
use crate::models::group::{get_groups, insert_group, CreatableGroup, Group};
use crate::models::player_in_group::get_player_count_in_group;
use crate::DbConn;

#[get("/groups")]
pub fn groups(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<Group>> {
    Json(get_groups(conn))
}

#[put("/groups", format = "application/json", data = "<group_name_json>")]
pub fn create_group(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_name_json: Result<Json<CreatableGroup>, JsonError>,
) -> Result<Json<Group>, String> {
    let cg = group_name_json.unwrap().0;

    let new_group = insert_group(conn, cg)?;

    Ok(Json(new_group))
}

#[get("/groups/<group_id>/playerCount")]
pub fn player_count_in_group(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<i64> {
    Json(get_player_count_in_group(conn, group_id))
}
