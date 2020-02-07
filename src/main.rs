#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;

use rocket_cors;
use rocket_cors::{AllowedHeaders, AllowedOrigins, Cors, CorsOptions};

pub mod dao;
pub mod models;
pub mod my_routes;
pub mod schema;

#[database("sqlite_schafkopfliste")]
pub struct DbConn(diesel::SqliteConnection);

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
    let routes = routes![
        my_routes::index,
        my_routes::authenticate,
        //        routes::game_types,
        my_routes::players,
        my_routes::create_player,
        my_routes::create_session
    ];

    rocket::ignite()
        .mount("/api", routes)
        .attach(DbConn::fairing())
        .attach(make_cors())
        .launch();
}
