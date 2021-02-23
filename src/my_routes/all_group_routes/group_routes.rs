use rocket::{get, put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::MyJwt;
use crate::models::group::{Group, NewGroup};
use crate::models::group_with_player_count::GroupWithPlayerCount;
use crate::models::player::Player;
use crate::models::player_in_group::{GroupWithPlayerMembership, GroupWithPlayersAndRuleSet};
use crate::DbConn;

use super::super::routes_helpers::{on_error, MyJsonResponse};
use rocket::response::status::BadRequest;

#[get("/")]
fn route_groups(conn: DbConn) -> MyJsonResponse<Vec<Group>> {
    use crate::daos::group_dao::select_groups;

    select_groups(&conn.0)
        .map_err(|err| on_error("Could not select groups from db", err))
        .map(Json)
}

#[put("/", format = "application/json", data = "<group_name_json>")]
fn route_create_group(
    _my_jwt: MyJwt,
    conn: DbConn,
    group_name_json: Json<NewGroup>,
) -> MyJsonResponse<Group> {
    use crate::daos::group_dao::insert_group;

    insert_group(&conn.0, group_name_json.0)
        .map_err(|err| on_error("Could not create group", err))
        .map(Json)
}

#[get("/groupsWithPlayerCount")]
fn route_groups_with_player_count(conn: DbConn) -> MyJsonResponse<Vec<GroupWithPlayerCount>> {
    use crate::daos::player_in_group_dao::select_groups_with_player_count;

    select_groups_with_player_count(&conn.0)
        .map_err(|err| on_error("Could not read from db", err))
        .map(Json)
}

#[get("/<group_id>/groupWithPlayersAndRuleSet")]
fn route_group_with_players_by_id(
    conn: DbConn,
    group_id: i32,
) -> MyJsonResponse<GroupWithPlayersAndRuleSet> {
    use crate::daos::player_in_group_dao::select_group_with_players_and_rule_set_by_id;

    select_group_with_players_and_rule_set_by_id(&conn.0, &group_id)
        .map_err(|err| on_error("", err))?
        .map(Json)
        .ok_or_else(|| BadRequest(Some("No such group!")))
}

#[get("/<group_id>")]
fn route_group_by_id(_my_jwt: MyJwt, conn: DbConn, group_id: i32) -> MyJsonResponse<Group> {
    use crate::daos::group_dao::select_group_by_id;

    select_group_by_id(&conn.0, &group_id)
        .map_err(|err| on_error("Could not find such a group", err))?
        .map(Json)
        .ok_or_else(|| BadRequest(Some("No such group!")))
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
) -> MyJsonResponse<bool> {
    use crate::daos::player_in_group_dao::toggle_group_membership;

    let data = data_try.map_err(|err| on_error("Could not read data from json", err))?;

    toggle_group_membership(&conn.0, group_id, (&data.0).0, (&data.0).1)
        .map_err(|err| on_error("Could not update group membership", err))
        .map(Json)
}

#[get("/<group_id>/players")]
fn route_players_in_group(
    _my_jwt: MyJwt,
    conn: DbConn,
    group_id: i32,
) -> MyJsonResponse<Vec<Player>> {
    use crate::daos::player_in_group_dao::select_players_in_group;

    select_players_in_group(&conn.0, &group_id)
        .map_err(|err| on_error("could not read from db", err))
        .map(Json)
}

#[get("/<group_id>/playersAndMembership")]
fn route_get_group_with_players_and_membership(
    _my_jwt: MyJwt,
    conn: DbConn,
    group_id: i32,
) -> MyJsonResponse<GroupWithPlayerMembership> {
    use crate::daos::player_in_group_dao::select_players_and_group_membership;

    select_players_and_group_membership(&conn.0, &group_id)
        .map_err(|err| on_error("could not read from db", err))?
        .map(Json)
        .ok_or_else(|| BadRequest(Some("No such group!")))
}

#[get("/<group_id>/recalculatedStatistics")]
fn route_get_recalculated_statistics(
    my_jwt: MyJwt,
    _conn: DbConn,
    group_id: i32,
) -> MyJsonResponse<bool> {
    //    use crate::models::game::select_games_for_group;
    //   use crate::models::session_dao::select_sessions_for_group;

    println!("{}", group_id);

    if !my_jwt.claims.user.is_admin {
        Err(on_error(
            "You need admin rights for this resource!",
            "No admin!",
        ))
    } else {
        /*
        let group = select_group_by_id(&conn.0, &group_id)
            .map_err(|err| on_error("Could not select group from db", err))?;

        let rule_set = select_rule_set_by_id(&conn.0, &group.rule_set_id)
            .map_err(|err| on_error("Could not read rule set from db", err))?;

        let sessions = select_sessions_for_group(&conn.0, &group_id);

        let priced_games = select_games_for_group(&conn.0, group_id)
            .map_err(|err| on_error("could not select games for group", err))?
            .into_iter()
            .map(|game| {
                let price = &game.calculate_price(&rule_set);
                PricedGame::new(game, *price)
            })
            .collect::<Vec<_>>();

        let players = select_players_in_group(&conn.0, &group_id);

        let result = players
            .iter()
            .map(|player| {
                let session_ids = sessions
                    .iter()
                    .filter(|s| s.player_has_partaken(&player.id))
                    .map(|s| s.id)
                    .collect::<Vec<_>>();

                let games_for_player = &priced_games
                    .into_iter()
                    .filter(|g| session_ids.contains(&g.game.session_id))
                    .collect::<Vec<PricedGame>>();

                todo!("Filter sessions player has taken part in!");

                analyze_games_for_player(&player.id, games_for_player)
            })
            .collect::<HashMap<_, _>>();

        println!("{:?}", result);
        */

        todo!("implement...")
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
        route_get_recalculated_statistics,
    ]
}
