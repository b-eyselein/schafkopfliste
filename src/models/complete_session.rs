use std::collections::HashMap;

use diesel::{self, result::Error as DbError, PgConnection};
use serde::Serialize;
use serde_tsi::prelude::*;

use super::game::PricedGame;
use super::game_dao::select_games_for_session;
use super::group::{select_group_by_id, Group};
use super::player::{select_player_by_id, Player};
use super::rule_set::{select_rule_set_by_id, RuleSet};
use super::session::select_session_by_id;

#[derive(Debug, Queryable, Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct SessionResult {
    pub balance: i32,
    pub game_count: i32,
    pub put_count: i32,
    pub played_games: i32,
    pub win_count: i32,
}

#[derive(Debug, Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct CompleteSession {
    id: i32,
    group: Group,

    has_ended: bool,

    date_year: i32,
    date_month: i32,
    date_day_of_month: i32,
    time_hours: i32,
    time_minutes: i32,

    first_player: Player,
    second_player: Player,
    third_player: Player,
    fourth_player: Player,

    rule_set: RuleSet,

    played_games: Vec<PricedGame>,
}

impl CompleteSession {
    fn players(&self) -> Vec<&Player> {
        vec![
            &self.first_player,
            &self.second_player,
            &self.third_player,
            &self.fourth_player,
        ]
    }

    pub fn analyze_session(&self) -> HashMap<i32, SessionResult> {
        self.players()
            .iter()
            .map(|player| {
                let mut balance = 0;
                let mut put_count = 0;
                let mut played_games = 0;
                let mut win_count = 0;

                for priced_game in &self.played_games {
                    let has_played = priced_game.player_has_acted(&player.id);
                    let has_won = priced_game.player_has_won(&player.id);

                    let solo_mult = if priced_game.is_solo() && has_played {
                        3
                    } else {
                        1
                    };

                    let won_mult = if has_won { 1 } else { -1 };

                    if priced_game.player_has_put(&player.id) {
                        put_count += 1;
                    }

                    if has_played {
                        played_games += 1;
                    }

                    if has_won {
                        win_count += 1;
                    }

                    balance += solo_mult * won_mult * priced_game.price
                }

                let session_result = SessionResult {
                    balance,
                    game_count: self.played_games.len() as i32,
                    put_count,
                    played_games,
                    win_count,
                };

                (player.id, session_result)
            })
            .collect::<HashMap<_, _>>()
    }
}

pub fn select_complete_session_by_id(
    conn: &PgConnection,
    the_group_id: &i32,
    the_serial_number: &i32,
) -> Result<CompleteSession, DbError> {
    let session = select_session_by_id(conn, the_group_id, the_serial_number)?;

    let rule_set = select_rule_set_by_id(conn, &session.rule_set_id)?;

    let games = select_games_for_session(conn, &session)
        .into_iter()
        .map(|game| {
            let price = &game.calculate_price(&rule_set);

            PricedGame::new(game, *price)
        })
        .collect();

    Ok(CompleteSession {
        id: session.id,
        has_ended: session.has_ended,
        date_year: session.date_year,
        date_month: session.date_month,
        date_day_of_month: session.date_day_of_month,
        time_hours: session.time_hours,
        time_minutes: session.time_minutes,
        group: select_group_by_id(conn, &session.group_id)?,
        first_player: select_player_by_id(conn, &session.first_player_id)?,
        second_player: select_player_by_id(conn, &session.second_player_id)?,
        third_player: select_player_by_id(conn, &session.third_player_id)?,
        fourth_player: select_player_by_id(conn, &session.fourth_player_id)?,
        rule_set,
        played_games: games,
    })
}
