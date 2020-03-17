use diesel::{PgConnection, QueryResult};

use crate::models::complete_session::CompleteSession;
use crate::models::game::PricedGame;

use super::game_dao::select_games_for_session;
use super::group_dao::select_group_by_id;
use super::player_dao::select_players_by_ids;
use super::rule_set_dao::select_rule_set_by_id;
use super::session_dao::select_session_by_id;
use super::session_result_dao::select_session_result_for_player;

pub fn select_complete_session_by_id(
    conn: &PgConnection,
    the_group_id: &i32,
    the_session_id: &i32,
) -> QueryResult<CompleteSession> {
    let session = select_session_by_id(conn, the_group_id, the_session_id)?;

    let group = select_group_by_id(conn, &session.group_id)?;

    let players = select_players_by_ids(conn, session.player_ids())?;

    let rule_set = select_rule_set_by_id(conn, &group.rule_set_id)?;

    let played_games = select_games_for_session(conn, the_session_id, the_group_id)?
        .into_iter()
        .map(|game| {
            let price = &game.calculate_price(&rule_set);
            PricedGame::new(game, *price)
        })
        .collect();

    let session_results = if session.has_ended {
        let y = players
            .iter()
            .map(|player| {
                select_session_result_for_player(conn, the_group_id, the_session_id, &player.id)
            })
            .collect::<Vec<_>>();

        Some(Vec::new())
    } else {
        None
    };

    Ok(CompleteSession {
        session,
        group,
        players,
        rule_set,
        played_games,
        session_results,
    })
}
