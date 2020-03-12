use rocket::{get, put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use super::routes_helpers::{on_error, MyJsonResponse};
use crate::jwt_helpers::MyJwt;
use crate::models::player::{CreatablePlayer, Player};
use crate::DbConn;

#[get("/")]
fn route_get_players(_my_jwt: MyJwt, conn: DbConn) -> MyJsonResponse<Vec<Player>> {
    use crate::models::player::select_players;

    select_players(&conn.0)
        .map_err(|err| on_error("could not read players from db", err))
        .map(Json)
}

#[put("/", format = "application/json", data = "<player_json_try>")]
fn route_create_player(
    _my_jwt: MyJwt,
    conn: DbConn,
    player_json_try: Result<Json<CreatablePlayer>, JsonError>,
) -> MyJsonResponse<Player> {
    use crate::models::player::insert_player;

    let player_json =
        player_json_try.map_err(|err| on_error("Could not read data from json", err))?;

    insert_player(&conn.0, player_json.0)
        .map_err(|err| on_error("Could not insert player into db", err))
        .map(Json)
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_get_players, route_create_player]
}
