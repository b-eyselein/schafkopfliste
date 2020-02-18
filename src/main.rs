#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_derive_enum;

use rocket_contrib::{database, serve::StaticFiles};
use rocket_cors::{Cors, CorsOptions};

mod jwt_helpers;
mod models;
mod my_routes;
mod schema;

#[database("schafkopfliste")]
pub struct DbConn(diesel::PgConnection);

fn make_cors() -> Cors {
    let cors_opts = CorsOptions {
        allow_credentials: true,
        ..Default::default()
    };

    cors_opts.to_cors().expect("Error while building cors!")
}

fn main() {
    rocket::ignite()
        .mount("/", StaticFiles::from("static"))
        .mount("/api/users", my_routes::user_routes::exported_routes())
        .mount(
            "/api/ruleSets",
            my_routes::rule_set_routes::exported_routes(),
        )
        .mount("/api/players", my_routes::player_routes::exported_routes())
        .mount("/api/groups", my_routes::group_routes::exported_routes())
        .attach(DbConn::fairing())
        .attach(make_cors())
        .launch();
}
