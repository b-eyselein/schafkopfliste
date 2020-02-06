#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
extern crate rocket_cors;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;

use rocket_cors::{AllowedHeaders, AllowedOrigins, Cors, CorsOptions};

pub mod models;
pub mod routes;
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
        routes::index,
        routes::game_types,
        routes::players,
        routes::create_player,
        routes::create_session
    ];

    rocket::ignite()
        .mount("/api", routes)
        .attach(DbConn::fairing())
        .attach(make_cors())
        .launch();
}
