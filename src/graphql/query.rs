use diesel::result::Error as DbError;
use juniper::{graphql_object, FieldError, FieldResult};

use crate::daos::group_dao::{select_group_by_name, select_groups};
use crate::daos::session_dao::select_session_by_id;
use crate::graphql::context::GraphQLContext;
use crate::models::group::Group;
use crate::models::player::{select_players, Player};
use crate::models::rule_set::{select_rule_set_by_id, select_rule_sets, RuleSet};
use crate::models::session::Session;

pub struct QueryRoot;

pub fn graphql_on_db_error(db_error: DbError) -> FieldError {
    eprintln!("Error while querying db: {}", db_error);
    "Error while querying db".into()
}

#[graphql_object(Context = GraphQLContext)]
impl QueryRoot {
    pub fn rule_sets(context: &GraphQLContext) -> FieldResult<Vec<RuleSet>> {
        let connection_mutex = context.connection.lock()?;

        select_rule_sets(&connection_mutex.0).map_err(graphql_on_db_error)
    }

    pub fn rule_set(name: String, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_rule_set_by_id(&connection_mutex.0, &name)?)
    }

    pub fn players(context: &GraphQLContext) -> FieldResult<Vec<Player>> {
        let connection_mutex = context.connection.lock()?;

        select_players(&connection_mutex.0).map_err(graphql_on_db_error)
    }

    pub fn groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        let connection_mutex = context.connection.lock()?;

        select_groups(&connection_mutex.0).map_err(graphql_on_db_error)
    }

    pub fn group(name: String, context: &GraphQLContext) -> FieldResult<Option<Group>> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_group_by_name(&connection_mutex.0, &name)?)
    }

    pub fn session(id: i32, group_name: String, context: &GraphQLContext) -> FieldResult<Option<Session>> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_session_by_id(&connection_mutex.0, &group_name, &id)?)
    }
}
