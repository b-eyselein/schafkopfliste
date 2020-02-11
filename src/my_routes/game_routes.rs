use rocket::Route;
use rocket_contrib::json::Json;
use uuid::Uuid;

use crate::jwt_helpers::MyJwtToken;
use crate::models::player::{get_players, Player};
use crate::models::player_in_group::select_players_in_group;
use crate::models::session::CreatableSession;
use crate::DbConn;

#[get("/")]
fn index(conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(&conn.0))
}

#[get("/groups/<group_id>/players")]
fn players_in_group(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<Vec<Player>> {
    Json(select_players_in_group(&conn.0, group_id))
}

#[put("/sessions", format = "application/json", data = "<creatable_session>")]
fn create_session(
    _my_jwt: MyJwtToken,
    _conn: DbConn,
    creatable_session: Json<CreatableSession>,
) -> Result<Json<i32>, String> {
    println!("{:?}", creatable_session);

    let uuid = Uuid::new_v4().to_string();

    //    let session = Session::from_creatable_session(uuid, creatable_session.0);

    //   println!("{:?}", session);

    Err("Not yet implemented".into())
}

pub fn exported_routes() -> Vec<Route> {
    routes![index, players_in_group, create_session]
}
