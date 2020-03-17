use rocket::{get, routes, Route};
use rocket_contrib::json::Json;

use crate::models::rule_set::{select_rule_sets, RuleSet};
use crate::my_routes::routes_helpers::{on_error, MyJsonResponse};
use crate::DbConn;

#[get("/")]
fn route_get_rule_sets(conn: DbConn) -> MyJsonResponse<Vec<RuleSet>> {
    select_rule_sets(&conn.0)
        .map_err(|err| on_error("Error while querying db", err))
        .map(Json)
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_get_rule_sets]
}
