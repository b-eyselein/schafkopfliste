#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_derive_enum;
#[macro_use]
extern crate diesel_migrations;

use diesel::PgConnection;
use rocket::{get, response::Redirect, routes};
use rocket_contrib::database;
use rocket_contrib::serve::StaticFiles;
use rocket_cors::{Cors, CorsOptions};
use ts_type_writer::write_all_ts_types;

mod jwt_helpers;
mod models;
mod my_routes;
mod schema;
mod ts_type_writer;

embed_migrations!();

#[database("schafkopfliste")]
pub struct DbConn(PgConnection);

fn make_cors() -> Cors {
    let cors_opts = CorsOptions {
        allow_credentials: true,
        ..Default::default()
    };

    cors_opts.to_cors().expect("Error while building cors!")
}

#[get("/")]
fn route_index() -> Redirect {
    Redirect::to("/app/")
}

fn main() {
    write_all_ts_types();

    use diesel::prelude::*;

    let db_conn = diesel::pg::PgConnection::establish("postgres://skl:1234@localhost/skl")
        .expect("Could not establish connection to database");

    embedded_migrations::run_with_output(&db_conn, &mut std::io::stdout())
        .expect("Could not run migrations on database");

    rocket::ignite()
        .mount("/", routes![route_index])
        .mount("/app", StaticFiles::from("static"))
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
