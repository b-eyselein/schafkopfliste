use rocket::{put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwt;
use crate::models::game::{upsert_game, Game, PricedGame};
use crate::models::rule_set::select_rule_set_by_id;
use crate::DbConn;

use super::super::routes_helpers::{on_error, MyJsonResponse};

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
) -> MyJsonResponse<PricedGame> {
    use crate::daos::group_dao::select_group_by_id;
    use crate::daos::session_dao::select_session_has_ended;

    let game_json = game_json_try.map_err(|err| on_error("Could not read game from json!", err))?;

    let group = select_group_by_id(&conn.0, &group_id)
        .map_err(|err| on_error("Could not read group from db", err))?;

    let session_has_ended = select_session_has_ended(&conn.0, &group_id, &session_id)
        .map_err(|err| on_error("could not select session from db", err))?;

    let rule_set = select_rule_set_by_id(&conn.0, &group.rule_set_id)
        .map_err(|err| on_error("No ruleset for session found!", err))?;

    if session_has_ended {
        Err(on_error(
            "Session has already ended!",
            "User tried to add a game to a ended session!",
        ))
    } else {
        upsert_game(&conn.0, &game_json.0)
            .map_err(|err| on_error("Error while inserting game into db", err))
            .map(|inserted_game| {
                let price = &inserted_game.calculate_price(&rule_set);

                Json(PricedGame::new(inserted_game, *price))
            })
    }
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_create_game]
}
