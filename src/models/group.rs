use std::convert::TryFrom;

use diesel::{prelude::*, PgConnection, QueryResult};
use juniper::{graphql_object, FieldResult, GraphQLInputObject};
use serde::{Deserialize, Serialize};

use crate::daos::session_dao::select_sessions_for_group;
use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::player_in_group::{select_players_in_group, PlayerInGroup};
use crate::models::rule_set::{select_rule_set_by_id, RuleSet};
use crate::models::session::Session;
use crate::schema::groups;

#[derive(Debug, Serialize, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct Group {
    pub name: String,
    pub rule_set_name: String
}

impl Group {
    pub fn new(name: String, rule_set_name: String) -> Group {
        Group { name, rule_set_name }
    }
}

// GraphQL

#[derive(Debug, Insertable, GraphQLInputObject, Deserialize)]
#[table_name = "groups"]
pub struct GroupInput {
    name: String,
    rule_set_name: String
}

#[graphql_object(Context = GraphQLContext)]
impl Group {
    pub fn name(&self) -> &String {
        &self.name
    }

    pub fn rule_set_name(&self) -> &str {
        &self.rule_set_name
    }

    pub fn rule_set(&self, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_rule_set_by_id(&connection_mutex.0, &self.rule_set_name)?)
    }

    pub fn player_count(&self, context: &GraphQLContext) -> FieldResult<i32> {
        let connection_mutex = context.connection.lock()?;

        let count = select_player_count_for_group(&connection_mutex.0, &self.name).map_err(graphql_on_db_error)?;

        Ok(i32::try_from(count)?)
    }

    pub fn players(&self, context: &GraphQLContext) -> FieldResult<Vec<PlayerInGroup>> {
        let connection_mutex = context.connection.lock()?;

        select_players_in_group(&connection_mutex.0, &self.name).map_err(graphql_on_db_error)
    }

    pub fn sessions(&self, context: &GraphQLContext) -> FieldResult<Vec<Session>> {
        let connection_mutex = context.connection.lock()?;

        select_sessions_for_group(&connection_mutex.0, &self.name).map_err(graphql_on_db_error)
    }
}

// Queries

pub fn select_player_count_for_group(conn: &PgConnection, the_group_name: &str) -> QueryResult<i64> {
    use crate::schema::player_in_groups::dsl::*;

    player_in_groups.filter(group_name.eq(the_group_name)).count().first(conn)
}
