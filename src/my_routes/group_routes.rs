use rocket::Route;
use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwtToken;
use crate::models::game::{insert_game, Game};
use crate::models::group::{get_group, get_groups, insert_group, CreatableGroup, Group};
use crate::models::player::Player;
use crate::models::player_in_group::{
    add_player_to_group, select_group_with_players_and_rule_set_by_id,
    select_groups_with_player_count, select_players_in_group, GroupWithPlayerCount,
    GroupWithPlayersAndRuleSet,
};
use crate::models::session::{
    insert_session, select_session_by_id, select_session_with_players_and_rule_set_by_id,
    CompleteSession, CreatableSession, Session,
};
use crate::DbConn;

#[get("/")]
fn route_groups(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<Group>> {
    Json(get_groups(&conn.0))
}

#[put("/", format = "application/json", data = "<group_name_json>")]
fn route_create_group(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_name_json: Json<CreatableGroup>,
) -> Result<Json<Group>, String> {
    let new_group = insert_group(&conn.0, group_name_json.0)?;

    Ok(Json(new_group))
}

#[get("/groupsWithPlayerCount")]
fn route_groups_with_player_count(
    _my_jwt: MyJwtToken,
    conn: DbConn,
) -> Json<Vec<GroupWithPlayerCount>> {
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
fn route_group_by_id(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<Option<Group>> {
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
fn route_players_in_group(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<Vec<Player>> {
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
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    serial_number: i32,
) -> Json<Option<CompleteSession>> {
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
    my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    creatable_session_json: Json<CreatableSession>,
) -> Result<Json<Session>, String> {
    insert_session(
        &conn.0,
        group_id,
        my_jwt.claims.username,
        creatable_session_json.0,
    )
    .map(Json)
}

#[put(
    "/<group_id>/sessions/<session_id>/games",
    format = "application/json",
    data = "<game_json_try>"
)]
fn route_create_game(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    session_id: i32,
    game_json_try: Result<Json<Game>, JsonError>,
) -> Result<Json<Game>, String> {
    game_json_try
        .map_err(|err| -> String {
            println!("Error while deserializing game json: {:?}", err);
            "Could not deserialize game!".into()
        })
        .and_then(|game_json| {
            println!("{:?}", game_json);

            insert_game(&conn.0, group_id, session_id, game_json.0).map(Json)
        })
}

pub fn exported_routes() -> Vec<Route> {
    routes![
        route_groups,
        route_create_group,
        route_groups_with_player_count,
        route_group_with_players_by_id,
        route_group_by_id,
        route_players_in_group,
        route_add_player_to_group,
        route_get_session,
        route_get_session_with_players_and_rule_set,
        route_create_session,
        route_create_game
    ]
}
