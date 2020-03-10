use bcrypt::{hash, verify, DEFAULT_COST};
use rocket::response::status::BadRequest;
use rocket::{put, routes, Route};
use rocket_contrib::json::{Json, JsonError};

use super::routes_helpers::{on_error, MyJsonResponse};
use crate::jwt_helpers::generate_token;
use crate::models::user::{
    insert_user, user_by_username, Credentials, RegisterValues, SerializableUser, User,
    UserWithToken,
};
use crate::DbConn;

#[put(
    "/authentication",
    format = "application/json",
    data = "<credentials_json_try>"
)]
fn route_authenticate(
    conn: DbConn,
    credentials_json_try: Result<Json<Credentials>, JsonError>,
) -> MyJsonResponse<UserWithToken> {
    let base_error_msg = "This combination of username and password is not valid!";

    let credentials_json = credentials_json_try
        .map_err(|err| on_error("Could not read credentials from json!", err))?;

    let user = user_by_username(&conn.0, &credentials_json.username)
        .map_err(|err| on_error(base_error_msg, err))?;

    verify(credentials_json.password.clone(), &user.password_hash)
        .map_err(|err| on_error(base_error_msg, err))
        .and_then(|valid| {
            if valid {
                let user_with_token = generate_token(SerializableUser::from_user(user))
                    .map_err(|err| on_error(base_error_msg, err))?;

                Ok(Json(user_with_token))
            } else {
                Err(BadRequest(Some(base_error_msg.into())))
            }
        })
}

#[put(
    "/registration",
    format = "application/json",
    data = "<register_values_json_try>"
)]
pub fn route_registration(
    conn: DbConn,
    register_values_json_try: Result<Json<RegisterValues>, JsonError>,
) -> MyJsonResponse<SerializableUser> {
    let register_values = register_values_json_try
        .map_err(|err| on_error("Could not read values from json", err))?
        .0;

    if register_values.is_valid() {
        let hashed_pw = hash(register_values.password.clone(), DEFAULT_COST)
            .map_err(|err| on_error("Error while validating your data...", err))?;

        let to_insert = User::new(register_values.username.clone(), hashed_pw);

        insert_user(&conn.0, to_insert)
            .map_err(|err| on_error("Could not create new user", err))
            .map(|user| Json(SerializableUser::from_user(user)))
    } else {
        Err(BadRequest(Some(
            "The registration data is not valid!".into(),
        )))
    }
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_authenticate, route_registration]
}
