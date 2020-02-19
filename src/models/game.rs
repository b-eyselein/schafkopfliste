use diesel::{self, prelude::*, PgConnection};
use either::{Either, Left, Right};
use serde::{Deserialize, Serialize};

use crate::models::game_enums::*;
use crate::models::rule_set::{CountLaufende, RuleSet};
use crate::models::session::Session;
use crate::schema::games;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Game {
    id: i32,
    session_id: i32,
    group_id: i32,

    acting_player_id: i32,
    game_type: GameType,
    suit: Option<BavarianSuit>,

    is_doubled: bool,
    laufende_count: i32,
    schneider_schwarz: Option<SchneiderSchwarz>,

    players_having_put: Either<i32, Vec<i32>>,
    players_with_contra: Either<i32, Vec<i32>>,
    players_having_won_ids: Vec<i32>,
}

impl Game {
    fn laufende_price(&self, rule_set: &RuleSet) -> i32 {
        let laufende_abs = self.laufende_count.abs();

        let laufende_in_range = rule_set.min_laufende_incl <= self.laufende_count
            && laufende_abs <= rule_set.max_laufende_incl;

        let laufende_are_counted = match &rule_set.count_laufende {
            CountLaufende::Never => false,
            CountLaufende::OnlyLosers => self.laufende_count < 0,
            CountLaufende::Always => true,
        };

        if laufende_in_range && laufende_are_counted {
            laufende_abs * rule_set.laufende_price
        } else {
            0
        }
    }

    pub fn calculate_price(&self, rule_set: &RuleSet) -> i32 {
        let base_price = match self.game_type {
            GameType::Ruf => rule_set.base_price,
            _ => rule_set.solo_price,
        };

        let schneider_schwarz_price = match self.schneider_schwarz {
            None => 0,
            Some(SchneiderSchwarz::Schneider) => 5,
            Some(SchneiderSchwarz::Schwarz) => 10,
        };

        let leger_count = match &self.players_having_put {
            Left(count) => count.clone() as u32,
            Right(put_ids) => put_ids.len() as u32,
        };

        let contra_count = match &self.players_with_contra {
            Left(count) => count.clone() as u32,
            Right(contra_ids) => contra_ids.len() as u32,
        };

        let doubled_mult = if self.is_doubled { 2 } else { 1 };

        let price_sum = base_price + schneider_schwarz_price + self.laufende_price(rule_set);

        price_sum * doubled_mult * 2_i32.pow(leger_count) * 2_i32.pow(contra_count)
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PricedGame {
    id: i32,
    session_id: i32,
    group_id: i32,

    acting_player_id: i32,
    game_type: GameType,
    suit: Option<BavarianSuit>,

    is_doubled: bool,
    laufende_count: i32,
    schneider_schwarz: Option<SchneiderSchwarz>,

    players_having_put: Either<i32, Vec<i32>>,
    players_with_contra: Either<i32, Vec<i32>>,
    players_having_won_ids: Vec<i32>,

    price: i32,
}

impl PricedGame {
    pub fn from_game(game: Game, rule_set: &RuleSet) -> PricedGame {
        let price = &game.calculate_price(&rule_set);

        let Game {
            id,
            session_id,
            group_id,
            acting_player_id,
            game_type,
            suit,
            is_doubled,
            laufende_count,
            schneider_schwarz,
            players_having_put,
            players_with_contra,
            players_having_won_ids,
        } = game;

        PricedGame {
            id,
            session_id,
            group_id,
            acting_player_id,
            game_type,
            suit,
            is_doubled,
            laufende_count,
            schneider_schwarz,
            players_having_put,
            players_with_contra,
            players_having_won_ids,
            price: *price,
        }
    }
}

#[derive(Debug, Identifiable, Queryable, Insertable, Associations)]
#[belongs_to(Session)]
#[table_name = "games"]
struct DbGame {
    id: i32,
    session_id: i32,
    group_id: i32,

    acting_player_id: i32,
    game_type: GameType,
    suit: Option<BavarianSuit>,

    is_doubled: bool,
    laufende_count: i32,
    schneider_schwarz: Option<SchneiderSchwarz>,

    players_having_put_count: i32,
    players_having_put_ids: Option<Vec<i32>>,
    players_with_contra_count: i32,
    players_with_contra_ids: Option<Vec<i32>>,
    players_having_won_ids: Vec<i32>,

    price: i32,
}

impl DbGame {
    fn from_game(group_id: i32, session_id: i32, game: PricedGame) -> DbGame {
        let (players_having_put_count, players_having_put_ids) = match game.players_having_put {
            Left(count) => (count, None),
            Right(players_having_put_ids) => (
                players_having_put_ids.len() as i32,
                Some(players_having_put_ids),
            ),
        };
        let (players_with_contra_count, players_with_contra_ids) = match game.players_with_contra {
            Left(count) => (count, None),
            Right(players_with_contra_ids) => (
                players_with_contra_ids.len() as i32,
                Some(players_with_contra_ids),
            ),
        };

        DbGame {
            id: game.id,
            session_id,
            group_id,
            acting_player_id: game.acting_player_id,
            game_type: game.game_type,
            suit: game.suit,
            is_doubled: game.is_doubled,
            laufende_count: game.laufende_count,
            schneider_schwarz: game.schneider_schwarz,
            players_having_put_count,
            players_having_put_ids,
            players_with_contra_count,
            players_with_contra_ids,
            players_having_won_ids: game.players_having_won_ids,
            price: game.price,
        }
    }

    //noinspection RsSelfConvention
    fn to_game(db_game: DbGame) -> PricedGame {
        PricedGame {
            id: db_game.id,
            group_id: db_game.group_id,
            session_id: db_game.session_id,
            acting_player_id: db_game.acting_player_id,
            game_type: db_game.game_type,
            suit: db_game.suit,
            is_doubled: db_game.is_doubled,
            laufende_count: db_game.laufende_count,
            schneider_schwarz: db_game.schneider_schwarz,
            players_having_put: match db_game.players_having_put_ids {
                None => Left(db_game.players_having_put_count),
                Some(players_having_put_ids) => Right(players_having_put_ids),
            },
            players_with_contra: match db_game.players_with_contra_ids {
                None => Left(db_game.players_with_contra_count),
                Some(players_with_contra_ids) => Right(players_with_contra_ids),
            },
            players_having_won_ids: db_game.players_having_won_ids,
            price: db_game.price,
        }
    }
}

pub fn insert_game(
    conn: &PgConnection,
    group_id: i32,
    session_id: i32,
    game: PricedGame,
) -> Result<PricedGame, String> {
    let db_game: DbGame = DbGame::from_game(group_id, session_id, game);

    diesel::insert_into(games::table)
        .values(db_game)
        .returning(games::all_columns)
        .get_result(conn)
        .map(|db_game| DbGame::to_game(db_game))
        .map_err(|err| {
            println!("Error while inserting game into db: {}", err);
            "Error while inserting game into database".into()
        })
}

pub fn select_games_for_session(conn: &PgConnection, session: &Session) -> Vec<PricedGame> {
    DbGame::belonging_to(session)
        .load::<DbGame>(conn)
        .unwrap_or(Vec::new())
        .into_iter()
        .map(DbGame::to_game)
        .collect()
}
