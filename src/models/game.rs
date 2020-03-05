use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::games;

use super::game_enums::{BavarianSuit, GameType, KontraType, SchneiderSchwarz};
use super::rule_set::{CountLaufende, RuleSet};
use super::session::Session;

#[derive(
    Debug,
    Serialize,
    Deserialize,
    Identifiable,
    Queryable,
    Insertable,
    Associations,
    HasTypescriptType,
)]
#[belongs_to(Session)]
#[serde(rename_all = "camelCase")]
pub struct Game {
    pub id: i32,
    pub session_id: i32,
    pub group_id: i32,

    pub acting_player_id: i32,
    pub game_type: GameType,
    pub suit: Option<BavarianSuit>,
    pub tout: bool,

    pub is_doubled: bool,
    pub laufende_count: i32,
    pub schneider_schwarz: Option<SchneiderSchwarz>,

    pub players_having_put_ids: Vec<i32>,
    pub kontra: Option<KontraType>,
    pub players_having_won_ids: Vec<i32>,
    //    price: i32,
}

impl Game {
    fn base_price<'a>(&self, rule_set: &'a RuleSet) -> &'a i32 {
        match self.game_type {
            GameType::Ruf => rule_set.get_base_price(),
            _ => rule_set.get_solo_price(),
        }
    }

    fn laufende_price(laufende_count: &i32, rule_set: &RuleSet) -> i32 {
        let laufende_abs: i32 = std::cmp::min(laufende_count.abs(), rule_set.max_laufende_incl);

        let laufende_are_counted = match &rule_set.count_laufende {
            CountLaufende::Never => false,
            CountLaufende::OnlyLosers => *laufende_count < 0,
            CountLaufende::Always => true,
        };

        if laufende_abs >= rule_set.min_laufende_incl && laufende_are_counted {
            laufende_abs * rule_set.laufende_price
        } else {
            0
        }
    }

    pub fn calculate_price(&self, rule_set: &RuleSet) -> i32 {
        let base_price = self.base_price(&rule_set);

        let schneider_schwarz_price = match self.schneider_schwarz {
            None => 0,
            Some(SchneiderSchwarz::Schneider) => 5,
            Some(SchneiderSchwarz::Schwarz) => 10,
        };

        let leger_count = self.players_having_put_ids.len() as u32;

        let contra_count = self
            .kontra
            .as_ref()
            .map(|kontra| kontra.get_count())
            .unwrap_or(0);

        let doubled_mult = if self.is_doubled { 2 } else { 1 };

        let price_sum = base_price
            + schneider_schwarz_price
            + Game::laufende_price(&self.laufende_count, rule_set);

        let doubled_count = leger_count + contra_count;

        price_sum * doubled_mult * 2_i32.pow(doubled_count)
    }
}

#[derive(Debug, Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct PricedGame {
    game: Game,
    pub price: i32,
}

impl PricedGame {
    pub fn new(game: Game, price: i32) -> PricedGame {
        PricedGame { game, price }
    }

    pub fn player_has_acted(&self, player_id: &i32) -> bool {
        &self.game.acting_player_id == player_id
    }

    pub fn player_has_won(&self, player_id: &i32) -> bool {
        self.game.players_having_won_ids.contains(player_id)
    }

    pub fn player_has_put(&self, player_id: &i32) -> bool {
        self.game.players_having_put_ids.contains(player_id)
    }

    pub fn is_solo(&self) -> bool {
        self.game.game_type != GameType::Ruf
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_laufende_price() {
        let rs1 = RuleSet::new(1, 5, CountLaufende::Never);
        let rs2 = RuleSet::new(2, 5, CountLaufende::OnlyLosers);
        let rs3 = RuleSet::new(3, 5, CountLaufende::Always);

        // 0 Laufende
        assert_eq!(0, Game::laufende_price(&0, &rs1));
        assert_eq!(0, Game::laufende_price(&0, &rs2));
        assert_eq!(0, Game::laufende_price(&0, &rs3));

        // 2 Laufende
        assert_eq!(0, Game::laufende_price(&2, &rs1));
        assert_eq!(0, Game::laufende_price(&2, &rs2));
        assert_eq!(10, Game::laufende_price(&2, &rs3));

        // -2 Laufende
        assert_eq!(0, Game::laufende_price(&-2, &rs1));
        assert_eq!(10, Game::laufende_price(&-2, &rs2));
        assert_eq!(10, Game::laufende_price(&-2, &rs3));

        // 4 Laufende
        assert_eq!(0, Game::laufende_price(&4, &rs1));
        assert_eq!(0, Game::laufende_price(&4, &rs2));
        assert_eq!(20, Game::laufende_price(&4, &rs3));

        // -4 Laufende
        assert_eq!(0, Game::laufende_price(&-4, &rs1));
        assert_eq!(20, Game::laufende_price(&-4, &rs2));
        assert_eq!(20, Game::laufende_price(&-4, &rs3));

        // 5 Laufende
        assert_eq!(0, Game::laufende_price(&5, &rs1));
        assert_eq!(0, Game::laufende_price(&5, &rs2));
        assert_eq!(20, Game::laufende_price(&5, &rs3));

        // -5 Laufende
        assert_eq!(0, Game::laufende_price(&-5, &rs1));
        assert_eq!(20, Game::laufende_price(&-5, &rs2));
        assert_eq!(20, Game::laufende_price(&-5, &rs3));
    }
}
