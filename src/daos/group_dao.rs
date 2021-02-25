use diesel::{prelude::*, PgConnection, QueryResult};

use crate::models::group::{Group, GroupInput};

pub fn select_groups(conn: &PgConnection) -> QueryResult<Vec<Group>> {
    use crate::schema::groups::dsl::*;

    groups.load(conn)
}

pub fn select_group_by_name(
    conn: &PgConnection,
    the_group_name: &str,
) -> QueryResult<Option<Group>> {
    use crate::schema::groups::dsl::*;

    groups
        .filter(name.eq(the_group_name))
        .first(conn)
        .optional()
}

pub fn insert_group(conn: &PgConnection, new_group: GroupInput) -> QueryResult<Group> {
    use crate::schema::groups::dsl::*;

    diesel::insert_into(groups)
        .values(&new_group)
        .returning(groups::all_columns())
        .get_result(conn)
}
