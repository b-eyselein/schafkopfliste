use bcrypt::{hash, verify, DEFAULT_COST};
use diesel::prelude::*;
use juniper::{graphql_object, FieldError, FieldResult, Value};

use crate::daos::group_dao::insert_group;
use crate::graphql::context::GraphQLContext;
use crate::graphql::query::graphql_on_db_error;
use crate::jwt_helpers::generate_token;
use crate::models::game::{select_max_game_id, upsert_game, Game, GameInput};
use crate::models::group::{Group, GroupInput};
use crate::models::player::{insert_player, PlayerInput};
use crate::models::player_in_group::upsert_group_membership;
use crate::models::rule_set::{insert_rule_set, RuleSetInput};
use crate::models::session::{insert_session, SessionInput};
use crate::models::user::{insert_user, user_by_username, Credentials, RegisterUserInput, User, UserWithToken};

pub struct Mutations;

fn on_no_login() -> FieldError {
    FieldError::from("User is not logged in!")
}

#[graphql_object(Context = GraphQLContext)]
impl Mutations {
    pub fn register_user(register_user_input: RegisterUserInput, context: &GraphQLContext) -> FieldResult<String> {
        if !register_user_input.is_valid() {
            Err(FieldError::new("Input is not valid!", Value::null()))
        } else {
            let RegisterUserInput { username, password, .. } = register_user_input;

            let hashed_pw = hash(password, DEFAULT_COST)?;

            let to_insert = User::new(username, hashed_pw);

            let connection_mutex = context.connection.lock()?;

            insert_user(&connection_mutex.0, to_insert)
                .map_err(|_error| FieldError::new("Could not create user!", Value::null()))
                .map(|user| user.username)
        }
    }

    pub fn login(credentials: Credentials, context: &GraphQLContext) -> FieldResult<Option<UserWithToken>> {
        let Credentials { username, password } = credentials;

        match user_by_username(&context.connection.lock()?.0, &username)? {
            None => Ok(None),
            Some(User {
                username,
                is_admin,
                player_abbreviation,
                password_hash
            }) => {
                let password_ok = verify(password, &password_hash)?;

                if password_ok {
                    let token = generate_token(username, is_admin, player_abbreviation)?;

                    Ok(Some(token))
                } else {
                    Ok(None)
                }
            }
        }
    }

    pub fn create_rule_set(rule_set_input: RuleSetInput, context: &GraphQLContext) -> FieldResult<String> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => {
                insert_rule_set(&context.connection.lock()?.0, &rule_set_input)?;

                Ok(rule_set_input.name)
            }
        }
    }

    pub fn create_group(group_input: GroupInput, context: &GraphQLContext) -> FieldResult<Group> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => Ok(insert_group(&context.connection.lock()?.0, group_input)?)
        }
    }

    pub fn create_player(new_player: PlayerInput, context: &GraphQLContext) -> FieldResult<String> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => {
                insert_player(&context.connection.lock()?.0, &new_player)?;

                Ok(new_player.abbreviation)
            }
        }
    }

    pub fn add_player_to_group(player_name: String, group_name: String, new_state: bool, context: &GraphQLContext) -> FieldResult<bool> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => Ok(upsert_group_membership(&context.connection.lock()?.0, group_name, player_name, new_state)?)
        }
    }

    pub fn new_session(group_name: String, session_input: SessionInput, context: &GraphQLContext) -> FieldResult<i32> {
        let creator_username = context.authorization_header.token().ok_or_else(on_no_login)?.claims.username();

        Ok(insert_session(
            &context.connection.lock()?.0,
            group_name,
            creator_username.to_string(),
            session_input
        )?)
    }

    pub fn new_game(group_name: String, session_id: i32, game_input: GameInput, context: &GraphQLContext) -> FieldResult<Game> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => {
                let connection = &context.connection.lock()?.0;

                let GameInput {
                    acting_player_abbreviation,
                    game_type,
                    suit,
                    tout,
                    is_doubled,
                    laufende_count,
                    schneider_schwarz,
                    players_having_put_abbreviations,
                    kontra,
                    players_having_won_abbreviations
                } = game_input;

                connection
                    .transaction(|| {
                        let next_game_id = select_max_game_id(connection, &group_name, &session_id)?.map(|id| id + 1).unwrap_or(1);

                        let game = Game::new(
                            next_game_id,
                            session_id,
                            group_name,
                            acting_player_abbreviation,
                            game_type,
                            suit,
                            tout,
                            is_doubled,
                            laufende_count,
                            schneider_schwarz,
                            players_having_put_abbreviations,
                            kontra,
                            players_having_won_abbreviations
                        );

                        upsert_game(connection, &game)
                    })
                    .map_err(graphql_on_db_error)
            }
        }
    }
}
