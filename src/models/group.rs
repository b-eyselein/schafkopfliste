use juniper::{graphql_object, FieldResult};
use serde::{Deserialize, Serialize};

use crate::daos::player_in_group_dao::{select_player_count_for_group, select_players_in_group};
use crate::daos::session_dao::select_sessions_for_group;
use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::player::Player;
use crate::models::rule_set::{select_rule_set_by_id, RuleSet};
use crate::models::session::Session;
use crate::schema::groups;

#[derive(Debug, Deserialize, Insertable, juniper::GraphQLInputObject)]
#[table_name = "groups"]
#[serde(rename_all = "camelCase")]
pub struct NewGroup {
    pub name: String,
    pub rule_set_id: i32,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable)]
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

#[graphql_object(Context = GraphQLContext)]
impl Group {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn name(&self) -> &String {
        &self.name
    }

    pub fn rule_set_id(&self) -> &i32 {
        &self.rule_set_id
    }

    pub fn rule_set(&self, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_rule_set_by_id(
            &connection_mutex.0,
            &self.rule_set_id,
        )?)
    }

    pub fn player_count(&self, context: &GraphQLContext) -> FieldResult<i32> {
        let connection_mutex = context.connection.lock()?;

        select_player_count_for_group(&connection_mutex.0, self.id).map_err(graphql_on_db_error)
    }

    pub fn members(&self, context: &GraphQLContext) -> FieldResult<Vec<Player>> {
        let connection_mutex = context.connection.lock()?;

        select_players_in_group(&connection_mutex.0, &self.id).map_err(graphql_on_db_error)
    }

    pub fn sessions(&self, context: &GraphQLContext) -> FieldResult<Vec<Session>> {
        let connection_mutex = context.connection.lock()?;

        select_sessions_for_group(&connection_mutex.0, &self.id).map_err(graphql_on_db_error)
    }
}
