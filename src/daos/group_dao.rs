use diesel::{self, prelude::*, PgConnection, QueryResult};

use crate::models::group::{Group, NewGroup};

pub fn select_groups(conn: &PgConnection) -> QueryResult<Vec<Group>> {
    use crate::schema::groups::dsl::*;

    groups.load(conn)
}

pub fn select_group_by_id(conn: &PgConnection, the_group_id: &i32) -> QueryResult<Option<Group>> {
    use crate::schema::groups::dsl::*;

    groups.find(the_group_id).first(conn).optional()
}

pub fn insert_group(conn: &PgConnection, cg: NewGroup) -> QueryResult<Group> {
    use crate::schema::groups::dsl::*;

    diesel::insert_into(groups)
        .values(&cg)
        .returning(id)
        .get_result(conn)
        .map(|new_group_id| Group::new(new_group_id, cg.name, cg.rule_set_id))
}
