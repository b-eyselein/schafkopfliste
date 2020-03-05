use diesel::{self, PgConnection};
use serde::Serialize;
use serde_tsi::prelude::*;

use super::game::PricedGame;
use super::game_dao::select_games_for_session;
use super::group::{select_group_by_id, Group};
use super::player::{select_player_by_id, Player};
use super::rule_set::{select_rule_set_by_id, RuleSet};
use super::session::select_session_by_id;

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

pub fn select_complete_session_by_id(
    conn: &PgConnection,
    the_group_id: &i32,
    the_serial_number: &i32,
) -> Option<CompleteSession> {
    let session = select_session_by_id(conn, the_group_id, the_serial_number).ok()?;

    let rule_set = select_rule_set_by_id(conn, &session.rule_set_id).ok()?;

    let games = select_games_for_session(conn, &session)
        .into_iter()
        .map(|game| {
            let price = &game.calculate_price(&rule_set);

            PricedGame::new(game, *price)
        })
        .collect();

    Some(CompleteSession {
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
