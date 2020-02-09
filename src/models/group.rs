use diesel;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::schema::groups;
use crate::DbConn;

#[derive(Debug, Deserialize, Insertable)]
#[table_name = "groups"]
pub struct CreatableGroup {
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable)]
pub struct Group {
    pub id: i32,
    pub name: String,
}

impl Group {
    pub fn new(id: i32, name: String) -> Group {
        Group { id, name }
    }
}

pub fn get_groups(conn: DbConn) -> Vec<Group> {
    use crate::schema::groups::dsl::*;

    groups.load(&conn.0).unwrap_or_else(|e| {
        println!("Error while querying groups from database: {}", e);
        Vec::new()
    })
}

pub fn get_group(conn: DbConn, the_group_id: i32) -> Option<Group> {
    use crate::schema::groups::dsl::*;

    let x = groups.find(the_group_id).first(&conn.0);

    x.ok()
}

pub fn insert_group(conn: DbConn, cg: CreatableGroup) -> Result<Group, String> {
    use crate::schema::groups::dsl::*;

    diesel::insert_into(groups)
        .values(&cg)
        .returning(id)
        .get_result(&conn.0)
        .map_err(|_| format!("Error while inserting group with name {} into db", cg.name))
        .map(|new_group_id| Group::new(new_group_id, cg.name))
}
