use crate::graphql::mutation::on_no_login;
use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::game::game::{select_max_game_id, upsert_game, Game, GameInput};
use crate::models::session::update_end_session;
use diesel::prelude::*;
use juniper::{graphql_object, FieldResult};

pub struct SessionMutations {
    group_id: i32,
    session_id: i32,
}

impl SessionMutations {
    pub fn new(group_id: i32, session_id: i32) -> Self {
        Self { group_id, session_id }
    }
}

#[graphql_object(context = GraphQLContext)]
impl SessionMutations {
    pub async fn end_session(&self, context: &GraphQLContext) -> FieldResult<bool> {
        let group_id = self.group_id.clone();
        let session_id = self.session_id.clone();

        // FIXME: update values...

        Ok(context.connection.run(move |c| update_end_session(&c, &group_id, &session_id)).await?)
    }

    pub async fn new_game(&self, game_input: GameInput, context: &GraphQLContext) -> FieldResult<Game> {
        let group_id = self.group_id.clone();
        let session_id = self.session_id.clone();

        match context.authorization_header.username() {
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
                    players_having_won_nicknames,
                } = game_input;

                context
                    .connection
                    .run(move |connection| {
                        connection
                            .transaction(|| {
                                let next_game_id = select_max_game_id(connection, &group_id, &session_id)?.map(|id| id + 1).unwrap_or(1);

                                let game = Game::new(
                                    group_id,
                                    session_id,
                                    next_game_id,
                                    acting_player_nickname,
                                    game_type,
                                    suit,
                                    tout,
                                    is_doubled,
                                    laufende_count,
                                    schneider_schwarz,
                                    players_having_put_nicknames,
                                    kontra,
                                    players_having_won_nicknames,
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
