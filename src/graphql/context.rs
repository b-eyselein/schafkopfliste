use juniper::{FieldError, FieldResult};

use crate::models::user::User;
use crate::DbConn;

pub struct GraphQLContext {
    pub connection: DbConn,
    pub maybe_user: Option<User>,
}

impl GraphQLContext {
    pub fn new(conn: DbConn, maybe_user: Option<User>) -> Self {
        Self { connection: conn, maybe_user }
    }

    pub fn check_user_login(&self) -> FieldResult<&User> {
        self.maybe_user.as_ref().ok_or_else(|| FieldError::from("You are not logged in!"))
    }
}

impl juniper::Context for GraphQLContext {}
