use juniper::{FieldError, FieldResult};

use crate::daos::group_dao::{select_group_by_id, select_group_ids, select_groups};
use crate::models::group::Group;
use crate::models::rule_set::{select_rule_set_by_id, select_rule_set_ids, RuleSet};
use crate::DbConn;

pub struct GraphQLContext {
    pub connection: DbConn,
}

impl juniper::Context for GraphQLContext {}

pub struct QueryRoot {}

pub fn graphql_on_db_error(db_error: diesel::result::Error) -> FieldError {
    eprintln!("Error while querying db: {}", db_error);
    "Error while querying db".into()
}

#[juniper::object(Context = GraphQLContext)]
impl QueryRoot {
    pub fn rule_set_ids(context: &GraphQLContext) -> FieldResult<Vec<i32>> {
        select_rule_set_ids(&context.connection.0).map_err(|err| graphql_on_db_error(err))
    }

    pub fn rule_set(id: i32, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        FieldResult::Ok(select_rule_set_by_id(&context.connection.0, &id).ok())
    }

    pub fn group_ids(context: &GraphQLContext) -> FieldResult<Vec<i32>> {
        select_group_ids(&context.connection.0).map_err(|err| graphql_on_db_error(err))
    }

    pub fn groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        select_groups(&context.connection.0).map_err(|err| graphql_on_db_error(err))
    }

    pub fn group(id: i32, context: &GraphQLContext) -> FieldResult<Option<Group>> {
        FieldResult::Ok(select_group_by_id(&context.connection.0, &id).ok())
    }
}

pub struct Mutations {}

#[juniper::object(Context = GraphQLContext)]
impl Mutations {}
