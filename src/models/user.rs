use diesel::prelude::*;
use juniper::{GraphQLInputObject, GraphQLObject};
use serde::{Deserialize, Serialize};

use crate::schema::users;

// FIXME: remove (De)Serialize!

#[derive(Insertable, Queryable, GraphQLObject)]
pub struct User {
    pub username: String,
    #[graphql(skip)]
    pub password_hash: String,
}

impl User {
    pub fn new(username: String, password_hash: String) -> User {
        User { username, password_hash }
    }
}

/*
#[graphql_object(context = GraphQLContext)]
impl User {
    pub fn username(&self) -> &String {
        &self.username
    }
}
 */

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
    pub token: String,
}

impl UserWithToken {
    pub fn new(username: String, token: String) -> UserWithToken {
        UserWithToken { username, token }
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
