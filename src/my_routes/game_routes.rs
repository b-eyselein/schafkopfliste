use rocket_contrib::json::{Json, JsonError};
use uuid::Uuid;

use crate::DbConn;
use crate::jwt_helpers::MyJwtToken;
use crate::models::group::{CreatableGroup, get_groups, Group, insert_group};
use crate::models::player::{CreatablePlayer, get_players, insert_player, Player};
use crate::models::session::{CreatableSession, Session};

#[get("/")]
pub fn index(conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(conn))
}

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

#[get("/players")]
pub fn players(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(conn))
}

#[get("/groups/<_group_id>/players")]
pub fn players_in_group(
    _my_jwt: MyJwtToken,
    _conn: DbConn,
    _group_id: i32,
) -> Result<Json<Vec<Player>>, String> {
    Err("Not yet implemented!".into())
}

#[put("/players", format = "application/json", data = "<player_json>")]
pub fn create_player(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    player_json: Json<CreatablePlayer>,
) -> Result<Json<Player>, String> {
    let new_player = insert_player(conn, player_json.0)?;

    Ok(Json(new_player))
}

#[put("/sessions", format = "application/json", data = "<creatable_session>")]
pub fn create_session(
    _my_jwt: MyJwtToken,
    _conn: DbConn,
    creatable_session: Json<CreatableSession>,
) -> Result<Json<i32>, String> {
    println!("{:?}", creatable_session);

    let uuid = Uuid::new_v4().to_string();

    let session = Session::from_creatable_session(uuid, creatable_session.0);

    println!("{:?}", session);

    Err("Not yet implemented".into())
}
