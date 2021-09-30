use diesel::{prelude::*, PgConnection, QueryResult};
use juniper::{graphql_object, GraphQLInputObject, GraphQLObject};
use serde::{Deserialize, Serialize};

use crate::schema::users;
use crate::GraphQLContext;

// FIXME: remove (De)Serialize!

#[derive(Insertable, Queryable)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub is_admin: bool,
    pub player_nickname: Option<String>,
}

impl User {
    pub fn new(username: String, password_hash: String) -> User {
        User {
            username,
            password_hash,
            is_admin: false,
            player_nickname: None,
        }
    }
}

#[graphql_object(context = GraphQLContext)]
impl User {
    pub fn username(&self) -> &String {
        &self.username
    }

    pub fn is_admin(&self) -> &bool {
        &self.is_admin
    }
}

#[derive(Debug, Deserialize, GraphQLInputObject)]
#[serde(rename_all = "camelCase")]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize, GraphQLInputObject)]
#[serde(rename_all = "camelCase")]
pub struct RegisterUserInput {
    pub username: String,
    pub password: String,
    pub password_repeat: String,
}

impl RegisterUserInput {
    pub fn is_valid(&self) -> bool {
        !self.username.is_empty() && !self.password.is_empty() && !self.password_repeat.is_empty() && self.password == self.password_repeat
    }
}

#[derive(Serialize, GraphQLObject)]
pub struct UserWithToken {
    pub username: String,
    pub is_admin: bool,
    pub player_nickname: Option<String>,
    pub token: String,
}

impl UserWithToken {
    pub fn new(username: String, is_admin: bool, player_nickname: Option<String>, token: String) -> UserWithToken {
        UserWithToken {
            username,
            is_admin,
            player_nickname,
            token,
        }
    }
}

// Queries

pub fn user_by_username(conn: &PgConnection, name: &str) -> QueryResult<Option<User>> {
    use crate::schema::users::dsl::*;

    users.filter(username.eq(&name)).first(conn).optional()
}

pub fn insert_user(conn: &PgConnection, the_username: &str, the_password_hash: &str) -> QueryResult<String> {
    use crate::schema::users::dsl::*;

    diesel::insert_into(users)
        .values((username.eq(the_username), (password_hash.eq(the_password_hash))))
        .returning(username)
        .get_result(conn)
}
