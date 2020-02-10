use diesel::{self, prelude::*, PgConnection};
use serde::{Deserialize, Serialize};

use crate::schema::users;

#[derive(Debug, Serialize, Insertable, Queryable)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub player_id: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
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

pub fn user_by_username(conn: &PgConnection, name: &String) -> Option<User> {
    use crate::schema::users::dsl::*;

    users.filter(username.eq(&name)).first::<User>(conn).ok()
}
