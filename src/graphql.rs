use juniper::{FieldError, FieldResult};

use crate::daos::group_dao::{select_group_by_id, select_groups};
use crate::daos::session_dao::select_session_by_id;
use crate::models::group::Group;
use crate::models::rule_set::{select_rule_set_by_id, select_rule_sets, RuleSet};
use crate::models::session::Session;
use crate::models::user::{NewUser, User};
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
    pub fn rule_sets(context: &GraphQLContext) -> FieldResult<Vec<RuleSet>> {
        select_rule_sets(&context.connection.0).map_err(|err| graphql_on_db_error(err))
    }

    pub fn rule_set(id: i32, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        FieldResult::Ok(select_rule_set_by_id(&context.connection.0, &id).ok())
    }

    pub fn groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        select_groups(&context.connection.0).map_err(|err| graphql_on_db_error(err))
    }

    pub fn group(id: i32, context: &GraphQLContext) -> FieldResult<Option<Group>> {
        FieldResult::Ok(select_group_by_id(&context.connection.0, &id).ok())
    }

    pub fn session(
        id: i32,
        group_id: i32,
        context: &GraphQLContext,
    ) -> FieldResult<Option<Session>> {
        FieldResult::Ok(select_session_by_id(&context.connection.0, &group_id, &id).ok())
    }
}

pub struct Mutations {}

#[juniper::object(Context = GraphQLContext)]
impl Mutations {
    pub fn create_user(user: NewUser, context: &GraphQLContext) -> FieldResult<User> {
        Err("Not yet implemented!".into())
    }
}
