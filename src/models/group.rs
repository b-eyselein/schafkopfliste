use diesel::{self, prelude::*, PgConnection};
use serde::{Deserialize, Serialize};

use crate::schema::groups;

#[derive(Debug, Deserialize, Insertable)]
#[table_name = "groups"]
#[serde(rename_all = "camelCase")]
pub struct CreatableGroup {
    pub name: String,
    pub default_rule_set_id: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable)]
#[serde(rename_all = "camelCase")]
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

pub fn select_groups(conn: &PgConnection) -> Vec<Group> {
    groups::table.load(conn).unwrap_or(Vec::new())
}

pub fn select_group_by_id(conn: &PgConnection, group_id: &i32) -> Option<Group> {
    groups::table.find(group_id).first(conn).ok()
}

pub fn insert_group(conn: &PgConnection, cg: CreatableGroup) -> Result<Group, String> {
    use crate::schema::groups::dsl::*;

    let new_group_id_try = diesel::insert_into(groups)
        .values(&cg)
        .returning(id)
        .get_result(conn);

    match new_group_id_try {
        Err(_) => Err(format!(
            "Error while inserting group with name {} into db",
            cg.name
        )),
        Ok(new_group_id) => Ok(Group::new(new_group_id, cg.name)),
    }
}
