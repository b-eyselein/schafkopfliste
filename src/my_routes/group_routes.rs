use rocket::Route;
use rocket_contrib::json::Json;

use crate::jwt_helpers::MyJwtToken;
use crate::models::group::{get_group, get_groups, insert_group, CreatableGroup, Group};
use crate::models::player::Player;
use crate::models::player_in_group::{
    add_player_to_group, select_group_with_players_and_rule_set_by_id,
    select_groups_with_player_count, select_players_in_group, GroupWithPlayerCount,
    GroupWithPlayersAndRuleSet,
};
use crate::models::session::{
    insert_session, select_session_by_id, select_session_with_players_and_rule_set_by_id,
    CreatableSession, Session, SessionWithPlayersAndRuleSet,
};
use crate::DbConn;

#[get("/")]
fn groups(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<Group>> {
    Json(get_groups(&conn.0))
}

#[put("/", format = "application/json", data = "<group_name_json>")]
fn create_group(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_name_json: Json<CreatableGroup>,
) -> Result<Json<Group>, String> {
    let new_group = insert_group(&conn.0, group_name_json.0)?;

    Ok(Json(new_group))
}

#[get("/groupsWithPlayerCount")]
fn groups_with_player_count(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<GroupWithPlayerCount>> {
    Json(select_groups_with_player_count(&conn.0))
}

#[get("/<group_id>/groupWithPlayersAndRuleSet")]
fn route_group_with_players_by_id(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
) -> Json<Option<GroupWithPlayersAndRuleSet>> {
    Json(select_group_with_players_and_rule_set_by_id(
        &conn.0, group_id,
    ))
}

#[get("/<group_id>")]
fn group_by_id(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<Option<Group>> {
    Json(get_group(&conn.0, group_id))
}

#[put(
    "/<group_id>/players",
    format = "application/json",
    data = "<player_id>"
)]
fn route_add_player_to_group(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    player_id: Json<i32>,
) -> Json<bool> {
    Json(add_player_to_group(&conn.0, group_id, player_id.0))
}

#[get("/<group_id>/players")]
fn players_in_group(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<Vec<Player>> {
    Json(select_players_in_group(&conn.0, group_id))
}

#[get("/<group_id>/sessions/<serial_number>")]
fn route_get_session(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    serial_number: i32,
) -> Json<Option<Session>> {
    Json(select_session_by_id(&conn.0, group_id, serial_number))
}

#[get("/<group_id>/sessions/<serial_number>/sessionWithPlayersAndRuleSet")]
fn route_get_session_with_players_and_rule_set(
    //    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    serial_number: i32,
) -> Json<Option<SessionWithPlayersAndRuleSet>> {
    Json(select_session_with_players_and_rule_set_by_id(
        &conn.0,
        group_id,
        serial_number,
    ))
}

#[put(
    "/<group_id>/sessions",
    format = "application/json",
    data = "<creatable_session_json>"
)]
fn route_create_session(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    creatable_session_json: Json<CreatableSession>,
) -> Result<Json<Session>, String> {
    insert_session(&conn.0, group_id, creatable_session_json.0).map(Json)
}

pub fn exported_routes() -> Vec<Route> {
    routes![
        groups,
        create_group,
        groups_with_player_count,
        route_group_with_players_by_id,
        group_by_id,
        players_in_group,
        route_add_player_to_group,
        route_get_session,
        route_get_session_with_players_and_rule_set,
        route_create_session
    ]
}
