use rocket::{get, routes, Route};
use rocket_contrib::json::Json;

use crate::models::rule_set::{get_rule_sets, RuleSet};
use crate::DbConn;

#[get("/")]
fn route_get_rule_sets(conn: DbConn) -> Json<Vec<RuleSet>> {
    Json(get_rule_sets(&conn.0))
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_get_rule_sets]
}
