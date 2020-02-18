use rocket::{get, put, routes, Route};
use rocket_contrib::json;
use rocket_contrib::json::{Json, JsonValue};

use crate::jwt_helpers::MyJwtToken;
use crate::models::game::{insert_game, Game, PricedGame};
use crate::models::group::{
    insert_group, select_group_by_id, select_groups, CreatableGroup, Group,
};
use crate::models::player::Player;
use crate::models::player_in_group::{
    add_player_to_group, select_group_with_players_and_rule_set_by_id,
    select_groups_with_player_count, select_players_and_group_membership, select_players_in_group,
    GroupWithPlayerCount, GroupWithPlayersAndRuleSet,
};
use crate::models::rule_set::select_rule_set_by_id;
use crate::models::session::{
    insert_session, select_complete_session_by_id, select_session_by_id, select_sessions_for_group,
    CompleteSession, CreatableSession, Session,
};
use crate::DbConn;

#[get("/")]
fn route_groups(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<Group>> {
    Json(select_groups(&conn.0))
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
        &conn.0, &group_id,
    ))
}

#[get("/<group_id>")]
fn route_group_by_id(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<Option<Group>> {
    Json(select_group_by_id(&conn.0, &group_id))
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
    Json(select_players_in_group(&conn.0, &group_id))
}

#[get("/<group_id>/playersAndMembership")]
fn route_get_group_with_players_and_membership(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
) -> JsonValue {
    let group = select_group_by_id(&conn.0, &group_id);
    let players_with_membership = select_players_and_group_membership(&conn.0, &group_id);

    json!({
    "group" : group,
    "players": players_with_membership
     })
}

#[get("/<group_id>/sessions")]
fn route_get_sessions(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<Vec<Session>> {
    Json(select_sessions_for_group(&conn.0, &group_id))
}

#[get("/<group_id>/sessions/<serial_number>")]
fn route_get_session(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    serial_number: i32,
) -> Json<Option<Session>> {
    Json(select_session_by_id(&conn.0, &group_id, &serial_number))
}

#[get("/<group_id>/sessions/<serial_number>/sessionWithPlayersAndRuleSet")]
fn route_get_session_with_players_and_rule_set(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    serial_number: i32,
) -> Json<Option<CompleteSession>> {
    Json(select_complete_session_by_id(
        &conn.0,
        &group_id,
        &serial_number,
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
        Some(session) => match select_rule_set_by_id(&conn.0, &session.rule_set_id) {
            None => Err("No ruleset for session found!".into()),
            Some(rule_set) => {
                let game = game_json.0;

                let priced_game = PricedGame::from_game(game, &rule_set);

                insert_game(&conn.0, group_id, session_id, priced_game).map(Json)
            }
        },
    }
}

pub fn exported_routes() -> Vec<Route> {
    routes![
        route_groups,
        route_create_group,
        route_groups_with_player_count,
        route_group_with_players_by_id,
        route_group_by_id,
        route_players_in_group,
        route_get_group_with_players_and_membership,
        route_add_player_to_group,
        route_get_sessions,
        route_get_session,
        route_get_session_with_players_and_rule_set,
        route_create_session,
        route_create_game
    ]
}
