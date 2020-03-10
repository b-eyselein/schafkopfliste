use diesel::{self, prelude::*, result::Error as DbError, PgConnection};
use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::users;

#[derive(Insertable, Queryable)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub is_admin: bool,
    pub player_id: Option<i32>,
}

impl User {
    pub fn new(username: String, password_hash: String) -> User {
        User {
            username,
            password_hash,
            is_admin: false,
            player_id: None,
        }
    }
}

#[derive(Clone, Serialize, Deserialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct SerializableUser {
    pub username: String,
    pub is_admin: bool,
    pub player_id: Option<i32>,
}

impl SerializableUser {
    pub fn from_user(user: User) -> SerializableUser {
        SerializableUser {
            username: user.username,
            is_admin: user.is_admin,
            player_id: user.player_id,
        }
    }
}

#[derive(Deserialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct RegisterValues {
    pub username: String,
    pub password: String,
    pub password_repeat: String,
}

impl RegisterValues {
    pub fn is_valid(&self) -> bool {
        !self.username.is_empty()
            && !self.password.is_empty()
            && !self.password_repeat.is_empty()
            && self.password == self.password_repeat
    }
}

#[derive(Serialize, HasTypescriptType)]
pub struct UserWithToken {
    pub user: SerializableUser,
    pub token: String,
}

impl UserWithToken {
    pub fn new(user: SerializableUser, token: String) -> UserWithToken {
        UserWithToken { user, token }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub user: SerializableUser,
}

impl Claims {
    pub fn new(user: SerializableUser) -> Claims {
        Claims { user }
    }
}

pub fn user_by_username(conn: &PgConnection, name: &String) -> Result<User, DbError> {
    use crate::schema::users::dsl::*;

    users.filter(username.eq(&name)).first::<User>(conn)
}

pub fn insert_user(conn: &PgConnection, user: User) -> Result<User, DbError> {
    diesel::insert_into(users::table)
        .values(&user)
        .returning(users::all_columns)
        .get_result::<User>(conn)
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![
        SerializableUser::ts_type(),
        Credentials::ts_type(),
        RegisterValues::ts_type(),
        UserWithToken::ts_type(),
    ]
}
