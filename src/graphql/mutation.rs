use bcrypt::{hash, verify, DEFAULT_COST};
use diesel::prelude::*;
use juniper::{graphql_object, FieldError, FieldResult};

use crate::daos::group_dao::insert_group;
use crate::daos::session_dao::update_end_session;
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
    pub async fn register_user(register_user_input: RegisterUserInput, context: &GraphQLContext) -> FieldResult<String> {
        if !register_user_input.is_valid() {
            return Err(FieldError::from("Input is not valid!"));
        }

        let RegisterUserInput { username, password, .. } = register_user_input;

        let hashed_pw = hash(password, DEFAULT_COST)?;

        Ok(context
            .connection
            .run(move |c| insert_user(&c, &username, &hashed_pw))
            .await
            .map_err(|_error| FieldError::from("Could not create user!"))?)
    }

    pub async fn login(credentials: Credentials, context: &GraphQLContext) -> FieldResult<Option<UserWithToken>> {
        let Credentials { username, password } = credentials;

        let user = context.connection.run(move |c| user_by_username(&c, &username)).await?;

        match user {
            None => Ok(None),
            Some(User {
                username,
                is_admin,
                player_nickname,
                password_hash
            }) => {
                let password_ok = verify(password, &password_hash)?;

                if password_ok {
                    let token = generate_token(username, is_admin, player_nickname)?;

                    Ok(Some(token))
                } else {
                    Ok(None)
                }
            }
        }
    }

    pub async fn create_rule_set(rule_set_input: RuleSetInput, context: &GraphQLContext) -> FieldResult<String> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => Ok(context.connection.run(move |c| insert_rule_set(&c, &rule_set_input)).await?)
        }
    }

    pub async fn create_group(group_input: GroupInput, context: &GraphQLContext) -> FieldResult<Group> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => Ok(context.connection.run(move |c| insert_group(&c, group_input)).await?)
        }
    }

    pub async fn create_player(new_player: PlayerInput, context: &GraphQLContext) -> FieldResult<String> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => Ok(context.connection.run(move |c| insert_player(&c, &new_player)).await?)
        }
    }

    pub async fn add_player_to_group(player_name: String, group_name: String, new_state: bool, context: &GraphQLContext) -> FieldResult<bool> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => Ok(context
                .connection
                .run(move |c| upsert_group_membership(&c, group_name, player_name, new_state))
                .await?)
        }
    }

    pub async fn new_session(group_name: String, session_input: SessionInput, context: &GraphQLContext) -> FieldResult<i32> {
        let creator_username = context
            .authorization_header
            .token()
            .ok_or_else(on_no_login)?
            .claims
            .username()
            .to_string()
            .clone();

        Ok(context
            .connection
            .run(move |c| insert_session(&c, group_name, creator_username, session_input))
            .await?)
    }

    pub async fn end_session(group_name: String, session_id: i32, context: &GraphQLContext) -> FieldResult<bool> {
        Ok(context.connection.run(move |c| update_end_session(&c, &group_name, &session_id)).await?)
    }

    pub async fn new_game(group_name: String, session_id: i32, game_input: GameInput, context: &GraphQLContext) -> FieldResult<Game> {
        match context.authorization_header.token() {
            None => Err(on_no_login()),
            Some(_) => {
                let GameInput {
                    acting_player_nickname,
                    game_type,
                    suit,
                    tout,
                    is_doubled,
                    laufende_count,
                    schneider_schwarz,
                    players_having_put_nicknames,
                    kontra,
                    players_having_won_nicknames
                } = game_input;

                context
                    .connection
                    .run(move |connection| {
                        connection
                            .transaction(|| {
                                let next_game_id = select_max_game_id(connection, &group_name, &session_id)?.map(|id| id + 1).unwrap_or(1);

                                let game = Game::new(
                                    next_game_id,
                                    session_id,
                                    group_name,
                                    acting_player_nickname,
                                    game_type,
                                    suit,
                                    tout,
                                    is_doubled,
                                    laufende_count,
                                    schneider_schwarz,
                                    players_having_put_nicknames,
                                    kontra,
                                    players_having_won_nicknames
                                );

                                upsert_game(connection, &game)
                            })
                            .map_err(graphql_on_db_error)
                    })
                    .await
            }
        }
    }
}
