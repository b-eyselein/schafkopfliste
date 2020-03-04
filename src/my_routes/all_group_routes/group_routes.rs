use rocket::{get, put, routes, Route};
use rocket_contrib::json::Json;

use crate::jwt_helpers::MyJwtToken;
use crate::models::group::{
    insert_group, select_group_by_id, select_groups, CreatableGroup, Group,
};
use crate::models::player::Player;
use crate::models::player_in_group::{
    add_player_to_group, select_group_with_players_and_rule_set_by_id,
    select_groups_with_player_count, select_players_and_group_membership, select_players_in_group,
    GroupWithPlayerCount, GroupWithPlayerMembership, GroupWithPlayersAndRuleSet,
};
use crate::DbConn;

#[get("/")]
fn route_groups(conn: DbConn) -> Json<Vec<Group>> {
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
fn route_groups_with_player_count(conn: DbConn) -> Json<Vec<GroupWithPlayerCount>> {
    Json(select_groups_with_player_count(&conn.0))
}

#[get("/<group_id>/groupWithPlayersAndRuleSet")]
fn route_group_with_players_by_id(
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
) -> Json<Option<GroupWithPlayerMembership>> {
    Json(select_players_and_group_membership(&conn.0, &group_id))
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
    ]
}
