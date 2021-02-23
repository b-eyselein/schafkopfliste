#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_derive_enum;
#[macro_use]
extern crate diesel_migrations;

use diesel::PgConnection;
use juniper::{EmptySubscription, RootNode};
use juniper_rocket::{GraphQLRequest, GraphQLResponse};
use rocket::{get, post, response::Redirect, routes, State};
use rocket_contrib::database;
use rocket_contrib::serve::StaticFiles;
use rocket_cors::{Cors, CorsOptions};

use graphql::{GraphQLContext, Mutations, QueryRoot};

mod daos;
mod graphql;
mod jwt_helpers;
mod models;
mod my_routes;
mod schema;

type Schema = RootNode<'static, QueryRoot, Mutations, EmptySubscription<GraphQLContext>>;

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
fn route_get_graphql_handler(
    connection: DbConn,
    request: GraphQLRequest,
    schema: State<Schema>,
) -> GraphQLResponse {
    request.execute_sync(&schema, &GraphQLContext::new(connection))
}

#[post("/graphql", data = "<request>")]
fn route_post_graphql_handler(
    connection: DbConn,
    request: GraphQLRequest,
    schema: State<Schema>,
) -> GraphQLResponse {
    println!("Got query: {:?}", request);

    request.execute_sync(&schema, &GraphQLContext::new(connection))
}

fn execute_db_migrations() {
    use diesel::prelude::*;

    let db_conn = diesel::pg::PgConnection::establish("postgres://skl:1234@localhost/skl")
        .expect("Could not establish connection to database");

    embedded_migrations::run_with_output(&db_conn, &mut std::io::stdout())
        .expect("Could not run migrations on database");
}

fn main() {
    execute_db_migrations();

    rocket::ignite()
        .mount(
            "/",
            routes![
                route_index,
                route_get_graphiql,
                route_get_graphql_handler,
                route_post_graphql_handler
            ],
        )
        .mount("/app", StaticFiles::from("static"))
        .mount("/api/users", my_routes::user_routes())
        .mount(
            "/api/ruleSets",
            my_routes::rule_set_routes::exported_routes(),
        )
        .mount("/api/players", my_routes::player_routes::exported_routes())
        .mount(
            "/api/groups",
            my_routes::all_group_routes::exported_routes(),
        )
        .manage(Schema::new(QueryRoot, Mutations, EmptySubscription::new()))
        .attach(DbConn::fairing())
        .attach(make_cors())
        .launch();
}
