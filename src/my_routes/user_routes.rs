use bcrypt::verify;
use rocket::Route;
use rocket_contrib::json::Json;

use crate::jwt_helpers::generate_token;
use crate::models::user::{user_by_username, Credentials, UserWithToken};
use crate::DbConn;

#[put("/authentication", format = "application/json", data = "<credentials>")]
fn route_authenticate(
    conn: DbConn,
    credentials: Json<Credentials>,
) -> Result<Json<UserWithToken>, String> {
    match user_by_username(&conn.0, &credentials.username) {
        None => Err("This combination of username and password is not valid!".into()),
        Some(user) => {
            let pw = credentials.password.clone();

            if verify(pw, &user.password_hash).unwrap_or(false) {
                let user_with_token = generate_token(user.username)?;

                Ok(Json(user_with_token))
            } else {
                Err("Not authenticated!".into())
            }
        }
    }
}

pub fn exported_routes() -> Vec<Route> {
    routes![route_authenticate]
}
