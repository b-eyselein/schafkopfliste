use std::sync::{Arc, Mutex};

use juniper::{graphql_object, FieldError, FieldResult};

use crate::daos::group_dao::{insert_group, select_group_by_id, select_groups};
use crate::daos::player_dao::{insert_player, select_players};
use crate::daos::session_dao::select_session_by_id;
use crate::models::group::{Group, NewGroup};
use crate::models::player::{NewPlayer, Player};
use crate::models::rule_set::{select_rule_set_by_id, select_rule_sets, RuleSet};
use crate::models::session::Session;
use crate::models::user::{RegisterUserInput, User};
use crate::DbConn;

pub struct GraphQLContext {
    pub connection: Arc<Mutex<DbConn>>,
}

impl GraphQLContext {
    pub fn new(conn: DbConn) -> Self {
        Self {
            connection: Arc::new(Mutex::new(conn)),
        }
    }
}

impl juniper::Context for GraphQLContext {}

pub struct QueryRoot;

pub fn graphql_on_db_error(db_error: diesel::result::Error) -> FieldError {
    eprintln!("Error while querying db: {}", db_error);
    "Error while querying db".into()
}

#[graphql_object(Context = GraphQLContext)]
impl QueryRoot {
    pub fn rule_sets(context: &GraphQLContext) -> FieldResult<Vec<RuleSet>> {
        let connection_mutex = context.connection.lock()?;

        select_rule_sets(&connection_mutex.0).map_err(graphql_on_db_error)
    }

    pub fn rule_set(id: i32, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_rule_set_by_id(&connection_mutex.0, &id)?)
    }

    pub fn players(context: &GraphQLContext) -> FieldResult<Vec<Player>> {
        let connection_mutex = context.connection.lock()?;

        select_players(&connection_mutex.0).map_err(graphql_on_db_error)
    }

    pub fn groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        let connection_mutex = context.connection.lock()?;

        select_groups(&connection_mutex.0).map_err(graphql_on_db_error)
    }

    pub fn group(id: i32, context: &GraphQLContext) -> FieldResult<Option<Group>> {
        let connection_mutex = context.connection.lock()?;
        Ok(select_group_by_id(&connection_mutex.0, &id)?)
    }

    pub fn session(
        id: i32,
        group_id: i32,
        context: &GraphQLContext,
    ) -> FieldResult<Option<Session>> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_session_by_id(&connection_mutex.0, &group_id, &id)?)
    }
}

pub struct Mutations;

#[graphql_object(Context = GraphQLContext)]
impl Mutations {
    pub fn create_user(register_user_input: RegisterUserInput, _context: &GraphQLContext) -> FieldResult<User> {
        Err("Not yet implemented!".into())
    }

    pub fn create_group(new_group: NewGroup, context: &GraphQLContext) -> FieldResult<Group> {
        println!("{:?}", new_group);

        let connection_mutex = context.connection.lock()?;

        insert_group(&connection_mutex.0, new_group).map_err(graphql_on_db_error)
    }

    pub fn create_player(new_player: NewPlayer, context: &GraphQLContext) -> FieldResult<Player> {
        let connection_mutex = context.connection.lock()?;

        insert_player(&connection_mutex.0, new_player).map_err(graphql_on_db_error)
    }
}
