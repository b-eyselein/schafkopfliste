use juniper::{FieldError, FieldResult};

use crate::daos::group_dao::{insert_group, select_group_by_id, select_groups};
use crate::daos::player_dao::{insert_player, select_players};
use crate::daos::session_dao::select_session_by_id;
use crate::models::group::{Group, NewGroup};
use crate::models::player::{NewPlayer, Player};
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
        select_rule_sets(&context.connection.0).map_err(graphql_on_db_error)
    }

    pub fn rule_set(id: i32, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        FieldResult::Ok(select_rule_set_by_id(&context.connection.0, &id).ok())
    }

    pub fn players(context: &GraphQLContext) -> FieldResult<Vec<Player>> {
        select_players(&context.connection.0).map_err(graphql_on_db_error)
    }

    pub fn groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        select_groups(&context.connection.0).map_err(graphql_on_db_error)
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
    pub fn create_user(new_user: NewUser, _context: &GraphQLContext) -> FieldResult<User> {
        Err("Not yet implemented!".into())
    }

    pub fn create_group(new_group: NewGroup, context: &GraphQLContext) -> FieldResult<Group> {
        println!("{:?}", new_group);
        insert_group(&context.connection.0, new_group).map_err(graphql_on_db_error)
    }

    pub fn create_player(new_player: NewPlayer, context: &GraphQLContext) -> FieldResult<Player> {
        insert_player(&context.connection.0, new_player).map_err(graphql_on_db_error)
    }
}
