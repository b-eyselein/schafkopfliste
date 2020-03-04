use rocket::{put, routes, Route};
use rocket_contrib::json::Json;

use crate::jwt_helpers::MyJwtToken;
use crate::models::game::{Game, PricedGame};
use crate::models::game_dao::insert_game;
use crate::models::rule_set::select_rule_set_by_id;
use crate::models::session::select_session_by_id;
use crate::DbConn;

#[put(
    "/<group_id>/sessions/<session_id>/games",
    format = "application/json",
    data = "<game_json>"
)]
fn route_create_game(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    session_id: i32,
    game_json: Json<Game>,
) -> Result<Json<PricedGame>, String> {
    let maybe_session = select_session_by_id(&conn.0, &group_id, &session_id);

    match maybe_session {
        None => Err(format!(
            "No session with id {} for group {} found!",
            session_id, group_id
        )),
        Some(session) => match select_rule_set_by_id(&conn.0, session.rule_set_id()) {
            None => Err("No ruleset for session found!".into()),
            Some(rule_set) => {
                let game = game_json.0;

                let db_game = Game {
                    session_id,
                    group_id,
                    ..game
                };

                insert_game(&conn.0, &db_game).map(|inserted_game| {
                    let price = &inserted_game.calculate_price(&rule_set);

                    Json(PricedGame::new(inserted_game, *price))
                })
            }
        },
    }
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_create_game]
}
