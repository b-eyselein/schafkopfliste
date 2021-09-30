#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_derive_enum;
#[macro_use]
extern crate diesel_migrations;

use std::path::{Path, PathBuf};

use diesel::PgConnection;
use juniper::EmptySubscription;
use juniper_rocket::{graphiql_source, GraphQLRequest, GraphQLResponse};
use rocket::fairing::AdHoc;
use rocket::response::status::NotFound;
use rocket::response::NamedFile;
use rocket::{get, post, routes, Rocket, State};
use rocket_contrib::database;
use rocket_contrib::serve::StaticFiles;
use rocket_cors::{Cors, CorsOptions};

use graphql::{GraphQLContext, Mutations, QueryRoot};

use crate::additional_headers::AuthorizationHeader;
use crate::graphql::Schema;

mod additional_headers;
mod daos;
mod graphql;
mod jwt_helpers;
mod models;
mod schema;

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
fn route_index() -> Result<NamedFile, NotFound<String>> {
    route_get_file("index.html".into())
}

#[get("/graphiql")]
fn route_get_graphiql() -> rocket::response::content::Html<String> {
    graphiql_source("/graphql", None)
}

#[get("/graphql?<request>")]
fn route_get_graphql_handler(connection: DbConn, authorization_header: AuthorizationHeader, request: GraphQLRequest, schema: State<Schema>) -> GraphQLResponse {
    request.execute_sync(&schema, &GraphQLContext::new(connection, authorization_header))
}

#[post("/graphql", data = "<request>")]
fn route_post_graphql_handler(
    connection: DbConn,
    authorization_header: AuthorizationHeader,
    request: GraphQLRequest,
    schema: State<Schema>
) -> GraphQLResponse {
    request.execute_sync(&schema, &GraphQLContext::new(connection, authorization_header))
}

#[get("/<file..>", rank = 2)]
fn route_get_file(file: PathBuf) -> Result<NamedFile, NotFound<String>> {
    let file_path = Path::new("./static").join(&file);

    let named_file_result = if file_path.exists() {
        NamedFile::open(file_path)
    } else {
        NamedFile::open(Path::new("./static").join("index.html"))
    };

    named_file_result.map_err(|_error| NotFound(format!("The file {} could not be found!", &file.display())))
}

fn execute_db_migrations(rocket: Rocket) -> Result<Rocket, Rocket> {
    let conn = DbConn::get_one(&rocket).expect("Could not establish connection to database!");

    match embedded_migrations::run_with_output(&*conn, &mut std::io::stdout()) {
        Ok(()) => Ok(rocket),
        Err(_) => Err(rocket)
    }
}

fn main() {
    rocket::ignite()
        .attach(DbConn::fairing())
        .attach(AdHoc::on_attach("Database migrations", execute_db_migrations))
        .attach(make_cors())
        .manage(Schema::new(QueryRoot, Mutations, EmptySubscription::new()))
        .mount(
            "/",
            routes![
                route_index,
                route_get_file,
                route_get_graphiql,
                route_get_graphql_handler,
                route_post_graphql_handler
            ]
        )
        .mount("/app", StaticFiles::from("static"))
        .launch();
}
