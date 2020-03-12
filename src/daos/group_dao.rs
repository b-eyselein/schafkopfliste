use crate::models::group::{CreatableGroup, Group};
use diesel::{self, prelude::*, result::Error as DbError, PgConnection};

pub fn select_groups(conn: &PgConnection) -> Result<Vec<Group>, DbError> {
    use crate::schema::groups::dsl::*;

    groups.load(conn)
}

pub fn select_group_by_id(conn: &PgConnection, the_group_id: &i32) -> Result<Group, DbError> {
    use crate::schema::groups::dsl::*;

    groups.find(the_group_id).first(conn)
}

pub fn insert_group(conn: &PgConnection, cg: CreatableGroup) -> Result<Group, DbError> {
    use crate::schema::groups::dsl::*;

    diesel::insert_into(groups)
        .values(&cg)
        .returning(id)
        .get_result(conn)
        .map(|new_group_id| Group::new(new_group_id, cg.name, cg.rule_set_id))
}
