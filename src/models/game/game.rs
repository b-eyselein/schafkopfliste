use diesel::dsl::max;
use diesel::{pg::PgConnection, prelude::*, result::QueryResult};
use juniper::{graphql_object, FieldError, FieldResult, GraphQLInputObject, Value};

use crate::graphql::GraphQLContext;
use crate::models::game::game_enums::{BavarianSuit, GameType, KontraType, SchneiderSchwarz};
use crate::models::rule_set::{select_rule_set_for_group, CountLaufende, RuleSet};
use crate::schema::games;

#[derive(Clone, Queryable, Insertable, AsChangeset)]
pub struct Game {
    pub id: i32,
    pub session_id: i32,
    pub group_name: String,

    pub acting_player_abbreviation: String,
    pub game_type: GameType,
    pub suit: Option<BavarianSuit>,
    pub tout: bool,

    pub is_doubled: bool,
    pub laufende_count: i32,
    pub schneider_schwarz: Option<SchneiderSchwarz>,

    pub players_having_put_abbreviations: Vec<String>,
    pub kontra: Option<KontraType>,
    pub players_having_won_abbreviations: Vec<String>
}

#[derive(Debug, GraphQLInputObject)]
pub struct GameInput {
    pub acting_player_abbreviation: String,
    pub game_type: GameType,
    pub suit: Option<BavarianSuit>,
    pub tout: bool,

    pub is_doubled: bool,
    pub laufende_count: i32,
    pub schneider_schwarz: Option<SchneiderSchwarz>,

    pub players_having_put_abbreviations: Vec<String>,
    pub kontra: Option<KontraType>,
    pub players_having_won_abbreviations: Vec<String>
}

impl Game {
    pub fn new(
        id: i32,
        session_id: i32,
        group_name: String,
        acting_player_abbreviation: String,
        game_type: GameType,
        suit: Option<BavarianSuit>,
        tout: bool,
        is_doubled: bool,
        laufende_count: i32,
        schneider_schwarz: Option<SchneiderSchwarz>,
        players_having_put_abbreviations: Vec<String>,
        kontra: Option<KontraType>,
        players_having_won_abbreviations: Vec<String>
    ) -> Self {
        Self {
            id,
            session_id,
            group_name,
            acting_player_abbreviation,
            game_type,
            suit,
            tout,
            is_doubled,
            laufende_count,
            schneider_schwarz,
            players_having_put_abbreviations,
            kontra,
            players_having_won_abbreviations
        }
    }

    pub fn player_has_acted(&self, player_abbreviation: &str) -> bool {
        self.acting_player_abbreviation == player_abbreviation
    }

    pub fn player_has_put(&self, player_abbreviation: &String) -> bool {
        self.players_having_put_abbreviations.contains(player_abbreviation)
    }

    pub fn player_has_won(&self, player_abbreviation: &String) -> bool {
        self.players_having_won_abbreviations.contains(player_abbreviation)
    }

    pub fn is_solo(&self) -> bool {
        self.game_type == GameType::Farbsolo
            || self.game_type == GameType::Wenz
            || self.game_type == GameType::Geier
            || self.game_type == GameType::Farbwenz
            || self.game_type == GameType::Farbgeier
    }

    fn base_price<'a>(&self, rule_set: &'a RuleSet) -> &'a i32 {
        match self.game_type {
            GameType::Ruf => rule_set.get_base_price(),
            _ => rule_set.get_solo_price()
        }
    }

    fn laufende_price(&self, rule_set: &RuleSet) -> i32 {
        use std::cmp::min;

        let laufende_are_counted = match &rule_set.count_laufende {
            CountLaufende::Never => false,
            CountLaufende::OnlyLosers => self.laufende_count < 0,
            CountLaufende::Always => true
        };

        let laufende_abs: i32 = min(self.laufende_count.abs(), rule_set.max_laufende_incl);

        if laufende_are_counted && laufende_abs >= rule_set.min_laufende_incl {
            laufende_abs * rule_set.laufende_price
        } else {
            0
        }
    }

    pub fn calculate_price(&self, rule_set: &RuleSet) -> i32 {
        let base_price = self.base_price(rule_set);

        let schneider_schwarz_price = match self.schneider_schwarz {
            None => 0,
            Some(SchneiderSchwarz::Schneider) => 5,
            Some(SchneiderSchwarz::Schwarz) => 10
        };

        let leger_count = self.players_having_put_abbreviations.len() as u32;

        let contra_count = self.kontra.as_ref().map(|kontra| kontra.get_count()).unwrap_or(0);

        let doubled_mult = if self.is_doubled { 2 } else { 1 };

        let price_sum = base_price + schneider_schwarz_price + self.laufende_price(rule_set);

        let doubled_count = leger_count + contra_count;

        price_sum * doubled_mult * 2_i32.pow(doubled_count)
    }
}

// GraphQL

#[graphql_object(context = GraphQLContext)]
impl Game {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn acting_player_abbreviation(&self) -> &str {
        &self.acting_player_abbreviation
    }

    pub fn game_type(&self) -> &GameType {
        &self.game_type
    }

    pub fn suit(&self) -> &Option<BavarianSuit> {
        &self.suit
    }

    pub fn tout(&self) -> &bool {
        &self.tout
    }

    pub fn is_doubled(&self) -> &bool {
        &self.is_doubled
    }

    pub fn laufende_count(&self) -> &i32 {
        &self.laufende_count
    }

    pub fn schneider_schwarz(&self) -> &Option<SchneiderSchwarz> {
        &self.schneider_schwarz
    }

    pub fn players_having_put_abbreviations(&self) -> &Vec<String> {
        &self.players_having_put_abbreviations
    }

    pub fn kontra(&self) -> &Option<KontraType> {
        &self.kontra
    }

    pub fn players_having_won_abbreviations(&self) -> &Vec<String> {
        &self.players_having_won_abbreviations
    }

    #[graphql(name = "price")]
    pub fn graphql_price(&self, context: &GraphQLContext) -> FieldResult<i32> {
        let connection = &context.connection.lock()?.0;

        let rule_set = select_rule_set_for_group(connection, &self.group_name)?.ok_or_else(|| FieldError::new("Could not find rule set!", Value::null()))?;

        Ok(self.calculate_price(&rule_set))
    }
}

// Queries

pub fn upsert_game(conn: &PgConnection, the_game: &Game) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    diesel::insert_into(games)
        .values(the_game)
        .on_conflict((id, session_id, group_name))
        .do_update()
        .set(the_game)
        //.returning(games::all_columns)
        .get_result(conn)
}

pub fn select_max_game_id(conn: &PgConnection, the_group_name: &str, the_session_id: &i32) -> QueryResult<Option<i32>> {
    use crate::schema::games::dsl::*;

    games
        .filter(group_name.eq(the_group_name))
        .filter(session_id.eq(the_session_id))
        .select(max(id))
        .first(conn)
}

pub fn select_games_for_group(conn: &PgConnection, the_group_name: &str) -> QueryResult<Vec<Game>> {
    use crate::schema::games::dsl::*;

    games.filter(group_name.eq(the_group_name)).load(conn)
}

pub fn select_games_for_session(conn: &PgConnection, the_session_id: &i32, the_group_name: &str) -> QueryResult<Vec<Game>> {
    use crate::schema::games::dsl::*;

    games
        .filter(session_id.eq(the_session_id))
        .filter(group_name.eq(the_group_name))
        .order_by(id)
        .load(conn)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_laufende_price() {
        let base_game = Game {
            id: 0,
            session_id: 0,
            group_name: "".to_string(),
            acting_player_abbreviation: "".to_string(),
            game_type: GameType::Ruf,
            suit: None,
            tout: false,
            is_doubled: false,
            laufende_count: 0,
            schneider_schwarz: None,
            players_having_put_abbreviations: vec![],
            kontra: None,
            players_having_won_abbreviations: vec![]
        };

        let rs_laufende_never = RuleSet::new(1, 5, CountLaufende::Never);
        let rs_laufende_only_losers = RuleSet::new(2, 5, CountLaufende::OnlyLosers);
        let rs_laufende_always = RuleSet::new(3, 5, CountLaufende::Always);

        let internal_test = |laufende_count, price_only_losers, price_always| {
            let game = Game {
                laufende_count,
                ..base_game.clone()
            };
            assert_eq!(0, game.laufende_price(&rs_laufende_never)); // rs_laufende_never will never charge laufende.
            assert_eq!(price_only_losers, game.laufende_price(&rs_laufende_only_losers));
            assert_eq!(price_always, game.laufende_price(&rs_laufende_always));
        };
        internal_test(0, 0, 0); // 0 Laufende
        internal_test(2, 0, 10); // 0 Laufende
        internal_test(-2, 10, 10); // 0 Laufende
        internal_test(4, 0, 20); // 0 Laufende
        internal_test(-4, 20, 20); // 0 Laufende
        internal_test(5, 0, 20); // 0 Laufende
        internal_test(-5, 20, 20); // 0 Laufende
    }
}
