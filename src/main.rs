#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_derive_enum;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;

use rocket_cors;
use rocket_cors::{AllowedHeaders, AllowedOrigins, Cors, CorsOptions};

mod jwt_helpers;
mod models;
mod my_routes;
mod schema;

#[database("schafkopfliste")]
pub struct DbConn(diesel::PgConnection);

fn make_cors() -> Cors {
    let cors_options = CorsOptions {
        allowed_origins: AllowedOrigins::all(),
        allowed_headers: AllowedHeaders::all(),
        allow_credentials: true,
        ..Default::default()
    };

    cors_options.to_cors().expect("Error while building cors!")
}

fn main() {
    let user_routes = routes![my_routes::user_routes::authenticate];

    let game_routes = routes![
        my_routes::game_routes::index,
        my_routes::group_routes::groups,
        my_routes::group_routes::groups_with_player_count,
        my_routes::group_routes::create_group,
        my_routes::group_routes::route_add_player_to_group,
        my_routes::group_routes::group_by_id,
        my_routes::game_routes::players_in_group,
        my_routes::game_routes::players,
        my_routes::game_routes::create_player,
        my_routes::game_routes::create_session
    ];

    rocket::ignite()
        .mount("/api/users", user_routes)
        .mount("/api", game_routes)
        .attach(DbConn::fairing())
        .attach(make_cors())
        .launch();
}
