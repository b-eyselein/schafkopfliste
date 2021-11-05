use diesel::prelude::*;
use juniper::GraphQLObject;

#[derive(Debug, Queryable)]
pub struct User {
    pub username: String,
    pub password_hash: String,
}

#[derive(GraphQLObject)]
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

pub fn select_user_by_username(conn: &PgConnection, name: &str) -> QueryResult<Option<User>> {
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
