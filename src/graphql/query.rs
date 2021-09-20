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
    FieldError::from("Error while querying db")
}

#[graphql_object(Context = GraphQLContext)]
impl QueryRoot {
    pub fn rule_sets(context: &GraphQLContext) -> FieldResult<Vec<RuleSet>> {
        Ok(select_rule_sets(&context.connection.lock()?.0)?)
    }

    pub fn rule_set(name: String, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        Ok(select_rule_set_by_id(&context.connection.lock()?.0, &name)?)
    }

    pub fn players(context: &GraphQLContext) -> FieldResult<Vec<Player>> {
        Ok(select_players(&context.connection.lock()?.0)?)
    }

    pub fn groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        Ok(select_groups(&context.connection.lock()?.0)?)
    }

    pub fn group(name: String, context: &GraphQLContext) -> FieldResult<Option<Group>> {
        Ok(select_group_by_name(&context.connection.lock()?.0, &name)?)
    }

    pub fn session(id: i32, group_name: String, context: &GraphQLContext) -> FieldResult<Option<Session>> {
        Ok(select_session_by_id(&context.connection.lock()?.0, &group_name, &id)?)
    }
}
