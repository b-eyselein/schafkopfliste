#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_derive_enum;
#[macro_use]
extern crate diesel_migrations;

use diesel::PgConnection;
use juniper::EmptySubscription;
use juniper_rocket::{GraphQLRequest, GraphQLResponse};
use rocket::fairing::AdHoc;
use rocket::{get, post, response::Redirect, routes, Rocket, State};
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
fn route_index() -> Redirect {
    Redirect::to("/app/")
}

#[get("/graphiql")]
fn route_get_graphiql() -> rocket::response::content::Html<String> {
    juniper_rocket::graphiql_source("/graphql", None)
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
            routes![route_index, route_get_graphiql, route_get_graphql_handler, route_post_graphql_handler]
        )
        .mount("/app", StaticFiles::from("static"))
        .launch();
}
