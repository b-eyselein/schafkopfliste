use diesel::prelude::*;
use juniper::{graphql_object, FieldResult, GraphQLInputObject};

use crate::graphql::mutation::on_no_login;
use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::game::game::{select_max_game_id, upsert_game, Game};
use crate::models::game::game_enums::{BavarianSuit, GameType, KontraType, SchneiderSchwarz};
use crate::models::session::update_end_session;

pub struct SessionMutations {
    group_id: i32,
    session_id: i32,
}

impl SessionMutations {
    pub fn new(group_id: i32, session_id: i32) -> Self {
        Self { group_id, session_id }
    }
}

#[derive(Debug, GraphQLInputObject)]
pub struct GameInput {
    pub acting_player_nickname: String,
    pub game_type: GameType,
    pub suit: Option<BavarianSuit>,
    pub tout: bool,

    pub is_doubled: bool,
    pub laufende_count: i32,
    pub schneider_schwarz: Option<SchneiderSchwarz>,

    pub players_having_put_nicknames: Vec<String>,
    pub kontra: Option<KontraType>,
    pub players_having_won_nicknames: Vec<String>,
}

#[graphql_object(context = GraphQLContext)]
impl SessionMutations {
    pub async fn end_session(&self, context: &GraphQLContext) -> FieldResult<bool> {
        let group_id = self.group_id;
        let session_id = self.session_id;

        // FIXME: update values...

        Ok(context.connection.run(move |c| update_end_session(c, &group_id, &session_id)).await?)
    }

    pub async fn new_game(&self, game_input: GameInput, context: &GraphQLContext) -> FieldResult<Game> {
        let group_id = self.group_id;
        let session_id = self.session_id;

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
