use diesel::{self, prelude::*, result::Error as DbError, PgConnection};
use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::groups;

#[derive(Debug, Deserialize, Insertable, HasTypescriptType)]
#[table_name = "groups"]
#[serde(rename_all = "camelCase")]
pub struct CreatableGroup {
    pub name: String,
    pub default_rule_set_id: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable, HasTypescriptType)]
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

pub fn select_group_by_id(conn: &PgConnection, group_id: &i32) -> Result<Group, DbError> {
    groups::table.find(group_id).first(conn)
}

pub fn insert_group(conn: &PgConnection, cg: CreatableGroup) -> Result<Group, DbError> {
    use crate::schema::groups::dsl::*;

    diesel::insert_into(groups)
        .values(&cg)
        .returning(id)
        .get_result(conn)
        .map(|new_group_id| Group::new(new_group_id, cg.name))
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![CreatableGroup::ts_type(), Group::ts_type()]
}
