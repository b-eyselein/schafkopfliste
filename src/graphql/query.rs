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
    pub async fn rule_sets(context: &GraphQLContext) -> FieldResult<Vec<RuleSet>> {
        Ok(context.connection.run(|c| select_rule_sets(&c)).await?)
    }

    pub async fn rule_set(name: String, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        Ok(context.connection.run(move |c| select_rule_set_by_id(&c, &name)).await?)
    }

    pub async fn players(context: &GraphQLContext) -> FieldResult<Vec<Player>> {
        Ok(context.connection.run(move |c| select_players(&c)).await?)
    }

    pub async fn groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        Ok(context.connection.run(move |c| select_groups(&c)).await?)
    }

    pub async fn group(name: String, context: &GraphQLContext) -> FieldResult<Option<Group>> {
        Ok(context.connection.run(move |c| select_group_by_name(&c, &name)).await?)
    }

    pub async fn session(id: i32, group_name: String, context: &GraphQLContext) -> FieldResult<Option<Session>> {
        Ok(context.connection.run(move |c| select_session_by_id(&c, &group_name, &id)).await?)
    }
}
