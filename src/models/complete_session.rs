use diesel::{self, result::Error as DbError, PgConnection};
use serde::Serialize;
use serde_tsi::prelude::*;

use super::accumulated_result::AccumulatedResult;
use super::game::{select_games_for_session, PricedGame};
use super::group::Group;
use super::group_dao::select_group_by_id;
use super::player::{select_player_by_id, Player};
use super::rule_set::{select_rule_set_by_id, RuleSet};
use super::session_dao::select_session_by_id;
use super::session_result::SessionResult;

#[derive(Serialize, HasTypescriptType)]
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
    session_results: Option<Vec<SessionResult>>,
}

impl CompleteSession {
    pub fn players(&self) -> Vec<&Player> {
        vec![
            &self.first_player,
            &self.second_player,
            &self.third_player,
            &self.fourth_player,
        ]
    }

    pub fn played_games(&self) -> &Vec<PricedGame> {
        &self.played_games
    }
}

pub fn analyze_games_for_player(
    player_id: &i32,
    games: &Vec<PricedGame>,
) -> (i32, AccumulatedResult) {
    let mut session_result = AccumulatedResult {
        game_count: games.len() as i32,
        balance: 0,
        put_count: 0,
        played_games: 0,
        win_count: 0,
    };

    for priced_game in games {
        let has_played = priced_game.player_has_acted(player_id);
        let has_won = priced_game.player_has_won(player_id);

        let solo_mult = if priced_game.is_solo() && has_played {
            3
        } else {
            1
        };

        let won_mult = if has_won { 1 } else { -1 };

        if priced_game.player_has_put(player_id) {
            session_result.put_count += 1;
        }

        if has_played {
            session_result.played_games += 1;
        }

        if has_won {
            session_result.win_count += 1;
        }

        session_result.balance += solo_mult * won_mult * priced_game.price
    }

    (*player_id, session_result)
}

pub fn select_complete_session_by_id(
    conn: &PgConnection,
    the_group_id: &i32,
    the_session_id: &i32,
) -> Result<CompleteSession, DbError> {
    let session = select_session_by_id(conn, the_group_id, the_session_id)?;

    let group = select_group_by_id(conn, &session.group_id)?;

    let rule_set = select_rule_set_by_id(conn, &group.rule_set_id)?;

    let played_games = select_games_for_session(conn, the_session_id, the_group_id)?
        .into_iter()
        .map(|game| {
            let price = &game.calculate_price(&rule_set);
            PricedGame::new(game, *price)
        })
        .collect();

    let session_results = if session.has_ended {
        Some(Vec::new())
    } else {
        None
    };

    Ok(CompleteSession {
        id: session.id,
        group,

        rule_set,

        date_year: session.date_year,
        date_month: session.date_month,
        date_day_of_month: session.date_day_of_month,
        time_hours: session.time_hours,
        time_minutes: session.time_minutes,

        has_ended: session.has_ended,

        first_player: select_player_by_id(conn, &session.first_player_id)?,
        second_player: select_player_by_id(conn, &session.second_player_id)?,
        third_player: select_player_by_id(conn, &session.third_player_id)?,
        fourth_player: select_player_by_id(conn, &session.fourth_player_id)?,

        played_games,
        session_results,
    })
}
