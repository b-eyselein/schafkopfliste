use diesel::{prelude::*, PgConnection, QueryResult};

use crate::models::user::User;

pub fn user_by_username(conn: &PgConnection, name: &String) -> QueryResult<User> {
    use crate::schema::users::dsl::*;

    users.filter(username.eq(&name)).first::<User>(conn)
}

pub fn insert_user(conn: &PgConnection, user: User) -> QueryResult<User> {
    use crate::schema::users;

    diesel::insert_into(users::table)
        .values(&user)
        .returning(users::all_columns)
        .get_result::<User>(conn)
}
