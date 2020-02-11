use rocket::Route;
use rocket_contrib::json::Json;

use crate::jwt_helpers::MyJwtToken;
use crate::models::game::{get_rule_sets, RuleSet};
use crate::DbConn;

#[get("/")]
fn route_get_rule_sets(_my_jwt: MyJwtToken, conn: DbConn) -> Json<Vec<RuleSet>> {
    Json(get_rule_sets(&conn.0))
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_get_rule_sets]
}
