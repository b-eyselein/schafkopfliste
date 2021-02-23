use juniper::graphql_object;
use serde::{Deserialize, Serialize};

use crate::schema::users;
use crate::GraphQLContext;

#[derive(juniper::GraphQLInputObject)]
pub struct NewUser {
    pub username: String,
    pub password: String,
    pub password_repeat: String,
}

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

#[graphql_object(context = GraphQLContext)]
impl User {
    pub fn username(&self) -> &String {
        &self.username
    }

    pub fn is_admin(&self) -> &bool {
        &self.is_admin
    }
}

#[derive(Clone, Serialize, Deserialize)]
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

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
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

#[derive(Serialize)]
pub struct UserWithToken {
    pub user: SerializableUser,
    pub token: String,
}

impl UserWithToken {
    pub fn new(user: SerializableUser, token: String) -> UserWithToken {
        UserWithToken { user, token }
    }
}
