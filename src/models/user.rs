use diesel::{self, prelude::*, result::Error as DbError, PgConnection};
use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::users;

// FIXME: remove Serialize or password!
#[derive(Debug, Serialize, Insertable, Queryable)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub player_id: Option<i32>,
}

#[derive(Debug, Deserialize, HasTypescriptType)]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, HasTypescriptType)]
pub struct UserWithToken {
    pub name: String,
    pub token: String,
}

impl UserWithToken {
    pub fn new(name: String, token: String) -> UserWithToken {
        UserWithToken { name, token }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub username: String,
}

impl Claims {
    pub fn new(username: String) -> Claims {
        Claims { username }
    }
}

pub fn user_by_username(conn: &PgConnection, name: &String) -> Result<User, DbError> {
    use crate::schema::users::dsl::*;

    users.filter(username.eq(&name)).first::<User>(conn)
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![Credentials::ts_type(), UserWithToken::ts_type()]
}
