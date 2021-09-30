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
use rocket::fs::NamedFile;
use rocket::response::status::NotFound;
use rocket::{get, post, routes, Build, Rocket, State};
use rocket_cors::{Cors, CorsOptions};
use rocket_sync_db_pools::database;

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
async fn route_index() -> Result<NamedFile, NotFound<String>> {
    route_get_file("index.html".into()).await
}

#[get("/graphiql")]
fn route_get_graphiql() -> rocket::response::content::Html<String> {
    graphiql_source("/graphql", None)
}

#[get("/graphql?<request>")]
fn route_get_graphql_handler(
    connection: DbConn,
    authorization_header: AuthorizationHeader,
    request: GraphQLRequest,
    schema: &State<Schema>,
) -> GraphQLResponse {
    request.execute_sync(&schema, &GraphQLContext::new(connection, authorization_header))
}

#[post("/graphql", data = "<request>")]
fn route_post_graphql_handler(
    connection: DbConn,
    authorization_header: AuthorizationHeader,
    request: GraphQLRequest,
    schema: &State<Schema>,
) -> GraphQLResponse {
    request.execute_sync(&schema, &GraphQLContext::new(connection, authorization_header))
}

#[get("/<file..>", rank = 2)]
async fn route_get_file(file: PathBuf) -> Result<NamedFile, NotFound<String>> {
    let file_path = Path::new("./static").join(&file);

    let named_file_result = if file_path.exists() {
        NamedFile::open(file_path)
    } else {
        NamedFile::open(Path::new("./static").join("index.html"))
    };

    named_file_result
        .await
        .map_err(|_error| NotFound(format!("The file {} could not be found!", &file.display())))
}

async fn execute_db_migrations(rocket: Rocket<Build>) -> Result<Rocket<Build>, Rocket<Build>> {
    let conn = DbConn::get_one(&rocket).await.expect("Could not establish connection to database!");

    conn.run(|c| match embedded_migrations::run_with_output(c, &mut std::io::stdout()) {
        Ok(()) => Ok(rocket),
        Err(_) => Err(rocket),
    })
    .await
}

#[rocket::launch]
fn rocket() -> _ {
    rocket::build()
        .attach(DbConn::fairing())
        .attach(AdHoc::try_on_ignite("Database migrations", execute_db_migrations))
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
            ],
        )
}
