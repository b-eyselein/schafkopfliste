use diesel;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::schema::groups;
use crate::DbConn;

#[derive(Debug, Deserialize, Insertable)]
#[table_name = "groups"]
pub struct CreatableGroup {
    pub name: String,
    pub default_rule_set_id: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable)]
pub struct Group {
    pub id: i32,
    pub name: String,
    pub default_rule_set_id: Option<i32>,
}

impl Group {
    pub fn new(id: i32, name: String) -> Group {
        Group {
            id,
            name,
            default_rule_set_id: None,
        }
    }
}

pub fn get_groups(conn: &DbConn) -> Vec<Group> {
    groups::table.load(&conn.0).unwrap_or(Vec::new())
}

pub fn get_group(conn: &DbConn, the_group_id: i32) -> Option<Group> {
    groups::table.find(the_group_id).first(&conn.0).ok()
}

pub fn insert_group(conn: &DbConn, cg: CreatableGroup) -> Result<Group, String> {
    use crate::schema::groups::dsl::*;

    diesel::insert_into(groups)
        .values(&cg)
        .returning(id)
        .get_result(&conn.0)
        .map_err(|_| format!("Error while inserting group with name {} into db", cg.name))
        .map(|new_group_id| Group::new(new_group_id, cg.name))
}
