use rocket_contrib::json::Json;
use uuid::Uuid;

use crate::dao::{get_groups, get_players, insert_player};
use crate::DbConn;
use crate::jwt_helpers::MyJwtToken;
use crate::models::player::{Group, Player, CreatablePlayer};
use crate::models::session::{CreatableSession, Session};

#[get("/")]
pub fn index(conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(conn))
}

#[get("/groups")]
pub fn groups(_my_jwt_token: MyJwtToken, conn: DbConn) -> Json<Vec<Group>> {
    Json(get_groups(conn))
}

#[get("/players")]
pub fn players(_my_jwt_token: MyJwtToken, conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(conn))
}

#[put("/players", format = "application/json", data = "<player_json>")]
pub fn create_player(
    _my_jwt_token: MyJwtToken,
    conn: DbConn,
    player_json: Json<CreatablePlayer>,
) -> Result<Json<Player>, String> {
    let x = insert_player(conn, &player_json.0)?;

    println!("{}", &x);

    let new_player = Player::from_creatable_player(x as i32, player_json.0);

    Ok(Json(new_player))
}

#[put("/sessions", format = "application/json", data = "<creatable_session>")]
pub fn create_session(
    _my_jwt_token: MyJwtToken,
    _conn: DbConn,
    creatable_session: Json<CreatableSession>,
) -> Result<Json<i32>, String> {
    println!("{:?}", creatable_session);

    let uuid = Uuid::new_v4().to_string();

    let session = Session::from_creatable_session(uuid, creatable_session.0);

    println!("{:?}", session);

    Err("Not yet implemented".into())
}
