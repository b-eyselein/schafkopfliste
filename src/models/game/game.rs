use crate::graphql::GraphQLContext;
use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::games;

use super::super::rule_set::{CountLaufende, RuleSet};
use super::game_enums::{BavarianSuit, GameType, KontraType, SchneiderSchwarz};

#[derive(
    Clone,
    Serialize,
    Deserialize,
    Identifiable,
    Queryable,
    Insertable,
    AsChangeset,
    HasTypescriptType,
)]
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
}

impl Game {
    fn base_price<'a>(&self, rule_set: &'a RuleSet) -> &'a i32 {
        match self.game_type {
            GameType::Ruf => rule_set.get_base_price(),
            _ => rule_set.get_solo_price(),
        }
    }

    fn laufende_price(&self, rule_set: &RuleSet) -> i32 {
        use std::cmp::min;

        let laufende_are_counted = match &rule_set.count_laufende {
            CountLaufende::Never => false,
            CountLaufende::OnlyLosers => self.laufende_count < 0,
            CountLaufende::Always => true,
        };

        let laufende_abs: i32 = min(self.laufende_count.abs(), rule_set.max_laufende_incl);

        if laufende_are_counted && laufende_abs >= rule_set.min_laufende_incl {
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

        let price_sum = base_price + schneider_schwarz_price + self.laufende_price(rule_set);

        let doubled_count = leger_count + contra_count;

        price_sum * doubled_mult * 2_i32.pow(doubled_count)
    }
}

#[juniper::object(context = GraphQLContext)]
impl Game {
    pub fn id(&self) -> &i32 {
        &self.id
    }
}

#[derive(Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct PricedGame {
    pub game: Game,
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
        let base_game = Game {
            id: 0,
            session_id: 0,
            group_id: 0,
            acting_player_id: 0,
            game_type: GameType::Ruf,
            suit: None,
            tout: false,
            is_doubled: false,
            laufende_count: 0,
            schneider_schwarz: None,
            players_having_put_ids: vec![],
            kontra: None,
            players_having_won_ids: vec![],
        };

        let rs1 = RuleSet::new(1, 5, CountLaufende::Never);
        let rs2 = RuleSet::new(2, 5, CountLaufende::OnlyLosers);
        let rs3 = RuleSet::new(3, 5, CountLaufende::Always);

        // 0 Laufende
        let game_zero = Game {
            laufende_count: 0,
            ..base_game.clone()
        };
        assert_eq!(0, game_zero.laufende_price(&rs1));
        assert_eq!(0, game_zero.laufende_price(&rs2));
        assert_eq!(0, game_zero.laufende_price(&rs3));

        // 2 Laufende
        let game_two = Game {
            laufende_count: 2,
            ..base_game.clone()
        };
        assert_eq!(0, game_two.laufende_price(&rs1));
        assert_eq!(0, game_two.laufende_price(&rs2));
        assert_eq!(10, game_two.laufende_price(&rs3));

        // -2 Laufende
        let game_minus_two = Game {
            laufende_count: -2,
            ..base_game.clone()
        };
        assert_eq!(0, game_minus_two.laufende_price(&rs1));
        assert_eq!(10, game_minus_two.laufende_price(&rs2));
        assert_eq!(10, game_minus_two.laufende_price(&rs3));

        // 4 Laufende
        let game_four = Game {
            laufende_count: 4,
            ..base_game.clone()
        };
        assert_eq!(0, game_four.laufende_price(&rs1));
        assert_eq!(0, game_four.laufende_price(&rs2));
        assert_eq!(20, game_four.laufende_price(&rs3));

        // -4 Laufende
        let game_minus_four = Game {
            laufende_count: -4,
            ..base_game.clone()
        };
        assert_eq!(0, game_minus_four.laufende_price(&rs1));
        assert_eq!(20, game_minus_four.laufende_price(&rs2));
        assert_eq!(20, game_minus_four.laufende_price(&rs3));

        // 5 Laufende
        let game_five = Game {
            laufende_count: 5,
            ..base_game.clone()
        };
        assert_eq!(0, game_five.laufende_price(&rs1));
        assert_eq!(0, game_five.laufende_price(&rs2));
        assert_eq!(20, game_five.laufende_price(&rs3));

        // -5 Laufende
        let game_minus_five = Game {
            laufende_count: -5,
            ..base_game.clone()
        };
        assert_eq!(0, game_minus_five.laufende_price(&rs1));
        assert_eq!(20, game_minus_five.laufende_price(&rs2));
        assert_eq!(20, game_minus_five.laufende_price(&rs3));
    }
}
