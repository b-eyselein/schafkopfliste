use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwtToken;
use crate::models::group::{get_group, get_groups, insert_group, CreatableGroup, Group};
use crate::models::player_in_group::{
    add_player_to_group, select_group_with_players_and_rule_set_by_id,
    select_groups_with_player_count, GroupWithPlayerCount, GroupWithPlayersAndRuleSet,
};
use crate::DbConn;

#[get("/groups")]
pub fn groups(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<Group>> {
    Json(get_groups(&conn))
}

#[put("/groups", format = "application/json", data = "<group_name_json>")]
pub fn create_group(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_name_json: Result<Json<CreatableGroup>, JsonError>,
) -> Result<Json<Group>, String> {
    let cg = group_name_json.unwrap().0;

    let new_group = insert_group(&conn, cg)?;

    Ok(Json(new_group))
}

#[get("/groupsWithPlayerCount")]
pub fn groups_with_player_count(
    _my_jwt: MyJwtToken,
    conn: DbConn,
) -> Json<Vec<GroupWithPlayerCount>> {
    Json(select_groups_with_player_count(&conn))
}

#[get("/groups/<group_id>/groupWithPlayersAndRuleSet")]
pub fn route_group_with_players_by_id(
    //    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
) -> Json<Option<GroupWithPlayersAndRuleSet>> {
    Json(select_group_with_players_and_rule_set_by_id(
        &conn, group_id,
    ))
}

#[get("/groups/<group_id>")]
pub fn group_by_id(_my_jwt: MyJwtToken, conn: DbConn, group_id: i32) -> Json<Option<Group>> {
    Json(get_group(&conn, group_id))
}

#[put(
    "/groups/<group_id>/players",
    format = "application/json",
    data = "<player_id>"
)]
pub fn route_add_player_to_group(
    _my_jwt: MyJwtToken,
    conn: DbConn,
    group_id: i32,
    player_id: Json<i32>,
) -> Json<bool> {
    Json(add_player_to_group(conn, group_id, player_id.0))
}
