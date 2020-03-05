use bcrypt::verify;
use rocket::response::status::BadRequest;
use rocket::{put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use crate::jwt_helpers::generate_token;
use crate::models::user::{user_by_username, Credentials, UserWithToken};
use crate::my_routes::routes_helpers::on_error;
use crate::DbConn;

#[put(
    "/authentication",
    format = "application/json",
    data = "<credentials_json_try>"
)]
fn route_authenticate(
    conn: DbConn,
    credentials_json_try: Result<Json<Credentials>, JsonError>,
) -> Result<Json<UserWithToken>, BadRequest<String>> {
    let base_error_msg = "This combination of username and password is not valid!";

    let credentials_json = credentials_json_try
        .map_err(|err| on_error("Could not read credentials from json!", err))?;

    let user = user_by_username(&conn.0, &credentials_json.username)
        .map_err(|err| on_error(base_error_msg, err))?;

    verify(credentials_json.password.clone(), &user.password_hash)
        .map_err(|err| on_error(base_error_msg, err))
        .and_then(|valid| {
            if valid {
                let user_with_token =
                    generate_token(user.username).map_err(|err| on_error(base_error_msg, err))?;

                Ok(Json(user_with_token))
            } else {
                Err(BadRequest(Some(base_error_msg.into())))
            }
        })
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_authenticate]
}
