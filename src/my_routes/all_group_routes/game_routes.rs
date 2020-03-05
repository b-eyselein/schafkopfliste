use rocket::{put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwt;
use crate::models::game::{Game, PricedGame};
use crate::models::game_dao::insert_game;
use crate::models::rule_set::select_rule_set_by_id;
use crate::models::session::select_session_by_id;
use crate::my_routes::routes_helpers::{on_db_error, on_json_error};
use crate::DbConn;

#[put(
    "/<group_id>/sessions/<session_id>/games",
    format = "application/json",
    data = "<game_json_try>"
)]
fn route_create_game(
    _my_jwt: MyJwt,
    conn: DbConn,
    group_id: i32,
    session_id: i32,
    game_json_try: Result<Json<Game>, JsonError>,
) -> Result<Json<PricedGame>, Json<String>> {
    let game_json =
        game_json_try.map_err(|err| on_json_error("Could not read game from json!", err))?;

    let session = select_session_by_id(&conn.0, &group_id, &session_id)
        .map_err(|err| on_db_error("No session with found!", err))?;

    let rule_set = select_rule_set_by_id(&conn.0, session.rule_set_id())
        .map_err(|err| on_db_error("No ruleset for session found!", err))?;

    if session.has_ended {
        Err(Json("Session has already ended!".into()))
    } else {
        insert_game(&conn.0, &game_json.0)
            .map_err(|err| on_db_error("Error while inserting game into db", err))
            .map(|inserted_game| {
                let price = &inserted_game.calculate_price(&rule_set);

                Json(PricedGame::new(inserted_game, *price))
            })
    }
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_create_game]
}
