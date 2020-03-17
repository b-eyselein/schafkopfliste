use diesel::{self, prelude::*, PgConnection, QueryResult};

use crate::models::group::{CreatableGroup, Group};

pub fn select_group_ids(conn: &PgConnection) -> QueryResult<Vec<i32>> {
    use crate::schema::groups::dsl::*;

    groups.select(id).load(conn)
}

#[deprecated]
pub fn select_groups(conn: &PgConnection) -> QueryResult<Vec<Group>> {
    use crate::schema::groups::dsl::*;

    groups.load(conn)
}

pub fn select_group_by_id(conn: &PgConnection, the_group_id: &i32) -> QueryResult<Group> {
    use crate::schema::groups::dsl::*;

    groups.find(the_group_id).first(conn)
}

pub fn insert_group(conn: &PgConnection, cg: CreatableGroup) -> QueryResult<Group> {
    use crate::schema::groups::dsl::*;

    diesel::insert_into(groups)
        .values(&cg)
        .returning(id)
        .get_result(conn)
        .map(|new_group_id| Group::new(new_group_id, cg.name, cg.rule_set_id))
}
