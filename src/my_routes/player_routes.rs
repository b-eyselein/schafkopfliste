use rocket::Route;
use rocket_contrib::json::Json;

use crate::jwt_helpers::MyJwtToken;
use crate::models::player::{get_players, insert_player, CreatablePlayer, Player};
use crate::DbConn;

#[get("/")]
fn players(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(&conn.0))
}

#[put("/", format = "application/json", data = "<player_json>")]
fn create_player(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    player_json: Json<CreatablePlayer>,
) -> Result<Json<Player>, String> {
    let new_player = insert_player(&conn.0, player_json.0)?;

    Ok(Json(new_player))
}

pub fn exported_routes() -> Vec<Route> {
    routes![players, create_player]
}
