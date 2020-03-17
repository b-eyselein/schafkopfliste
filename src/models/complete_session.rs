use serde::Serialize;
use serde_tsi::prelude::*;

use super::accumulated_result::AccumulatedResult;
use super::game::PricedGame;
use super::group::Group;
use super::player::Player;
use super::rule_set::RuleSet;
use super::session::Session;
use super::session_result::SessionResult;

#[derive(Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct CompleteSession {
    pub session: Session,
    pub group: Group,
    pub players: Vec<Player>,
    pub rule_set: RuleSet,
    pub played_games: Vec<PricedGame>,
    pub session_results: Option<Vec<SessionResult>>,
}

impl CompleteSession {
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
