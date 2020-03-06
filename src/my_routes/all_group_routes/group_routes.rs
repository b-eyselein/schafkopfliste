use rocket::response::status::BadRequest;
use rocket::{get, put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwt;
use crate::models::group::{
    insert_group, select_group_by_id, select_groups, CreatableGroup, Group,
};
use crate::models::player::Player;
use crate::models::player_in_group::{
    select_group_with_players_and_rule_set_by_id, select_groups_with_player_count,
    select_players_and_group_membership, select_players_in_group, toggle_group_membership,
    GroupWithPlayerCount, GroupWithPlayerMembership, GroupWithPlayersAndRuleSet,
};
use crate::my_routes::routes_helpers::on_error;
use crate::DbConn;

#[get("/")]
fn route_groups(conn: DbConn) -> Json<Vec<Group>> {
    Json(select_groups(&conn.0))
}

#[put("/", format = "application/json", data = "<group_name_json>")]
fn route_create_group(
    _my_jwt: MyJwt,
    conn: DbConn,
    group_name_json: Json<CreatableGroup>,
) -> Result<Json<Group>, BadRequest<String>> {
    insert_group(&conn.0, group_name_json.0)
        .map_err(|err| on_error("Could not create group", err))
        .map(Json)
}

#[get("/groupsWithPlayerCount")]
fn route_groups_with_player_count(conn: DbConn) -> Json<Vec<GroupWithPlayerCount>> {
    Json(select_groups_with_player_count(&conn.0))
}

#[get("/<group_id>/groupWithPlayersAndRuleSet")]
fn route_group_with_players_by_id(
    conn: DbConn,
    group_id: i32,
) -> Result<Json<GroupWithPlayersAndRuleSet>, BadRequest<String>> {
    select_group_with_players_and_rule_set_by_id(&conn.0, &group_id)
        .map_err(|err| on_error("", err))
        .map(Json)
}

#[get("/<group_id>")]
fn route_group_by_id(
    _my_jwt: MyJwt,
    conn: DbConn,
    group_id: i32,
) -> Result<Json<Group>, BadRequest<String>> {
    select_group_by_id(&conn.0, &group_id)
        .map_err(|err| on_error("Could not find such a group", err))
        .map(Json)
}

#[put(
    "/<group_id>/players",
    format = "application/json",
    data = "<data_try>"
)]
fn route_add_player_to_group(
    _my_jwt: MyJwt,
    conn: DbConn,
    group_id: i32,
    data_try: Result<Json<(i32, bool)>, JsonError>,
) -> Result<Json<bool>, BadRequest<String>> {
    let data = data_try.map_err(|err| on_error("Could not read data from json", err))?;

    toggle_group_membership(&conn.0, group_id, (&data.0).0, (&data.0).1)
        .map_err(|err| on_error("Could not update group membership", err))
        .map(Json)
}

#[get("/<group_id>/players")]
fn route_players_in_group(_my_jwt: MyJwt, conn: DbConn, group_id: i32) -> Json<Vec<Player>> {
    Json(select_players_in_group(&conn.0, &group_id))
}

#[get("/<group_id>/playersAndMembership")]
fn route_get_group_with_players_and_membership(
    _my_jwt: MyJwt,
    conn: DbConn,
    group_id: i32,
) -> Json<Option<GroupWithPlayerMembership>> {
    Json(select_players_and_group_membership(&conn.0, &group_id).ok())
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
