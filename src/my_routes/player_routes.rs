use rocket::response::status::BadRequest;
use rocket::{get, put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwt;
use crate::models::player::{get_players, insert_player, CreatablePlayer, Player};
use crate::my_routes::routes_helpers::on_error;
use crate::DbConn;

#[get("/")]
fn route_players(_my_jwt: MyJwt, conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(&conn.0))
}

#[put("/", format = "application/json", data = "<player_json_try>")]
fn route_create_player(
    _my_jwt: MyJwt,
    conn: DbConn,
    player_json_try: Result<Json<CreatablePlayer>, JsonError>,
) -> Result<Json<Player>, BadRequest<String>> {
    player_json_try
        .map_err(|err| on_error("Could not read data from json", err))
        .and_then(|player_json| {
            insert_player(&conn.0, player_json.0)
                .map_err(|err| on_error("Could not insert player into db", err))
                .map(Json)
        })
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_players, route_create_player]
}
