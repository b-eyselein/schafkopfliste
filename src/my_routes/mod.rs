mod routes_helpers;

pub mod all_group_routes;

pub mod player_routes;

pub mod rule_set_routes;

mod user_routes;

pub use user_routes::exported_routes as user_routes;
