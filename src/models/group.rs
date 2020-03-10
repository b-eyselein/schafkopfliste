use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::groups;

#[derive(Debug, Deserialize, Insertable, HasTypescriptType)]
#[table_name = "groups"]
#[serde(rename_all = "camelCase")]
pub struct CreatableGroup {
    pub name: String,
    pub rule_set_id: i32,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct Group {
    pub id: i32,
    pub name: String,
    pub rule_set_id: i32,
}

impl Group {
    pub fn new(id: i32, name: String, rule_set_id: i32) -> Group {
        Group {
            id,
            name,
            rule_set_id,
        }
    }
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![CreatableGroup::ts_type(), Group::ts_type()]
}
