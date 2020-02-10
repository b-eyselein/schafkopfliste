use rocket_contrib::json::Json;
use uuid::Uuid;

use crate::jwt_helpers::MyJwtToken;
use crate::models::game::{get_rule_sets, RuleSet};
use crate::models::player::{get_players, insert_player, CreatablePlayer, Player};
use crate::models::player_in_group::get_players_in_group;
use crate::models::session::{CreatableSession, Session};
use crate::DbConn;

#[get("/")]
pub fn index(conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(conn))
}

#[get("/ruleSets")]
pub fn route_get_rule_sets(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<RuleSet>> {
    Json(get_rule_sets(conn))
}

#[get("/players")]
pub fn players(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(conn))
}

#[get("/groups/<group_id>/players")]
pub fn players_in_group(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<Vec<Player>> {
    Json(get_players_in_group(conn, group_id))
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
