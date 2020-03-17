use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::daos::player_in_group_dao::select_player_count_for_group;
use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::rule_set::{select_rule_set_by_id, RuleSet};
use crate::schema::groups;
use juniper::FieldResult;

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

#[juniper::object(Context = GraphQLContext)]
impl Group {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn name(&self) -> &String {
        &self.name
    }

    pub fn rule_set(&self, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        FieldResult::Ok(select_rule_set_by_id(&context.connection.0, &self.rule_set_id).ok())
    }

    pub fn player_count(&self, context: &GraphQLContext) -> FieldResult<i32> {
        select_player_count_for_group(&context.connection.0, self.id)
            .map_err(|err| graphql_on_db_error(err))
    }
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![CreatableGroup::ts_type(), Group::ts_type()]
}
