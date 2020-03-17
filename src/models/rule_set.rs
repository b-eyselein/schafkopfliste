use diesel::{self, prelude::*, PgConnection, QueryResult};
use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::rule_sets;

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum, HasTypescriptType)]
#[DieselType = "Count_laufende"]
#[derive(juniper::GraphQLEnum)]
pub enum CountLaufende {
    Always,
    OnlyLosers,
    Never,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
#[derive(juniper::GraphQLObject)]
pub struct RuleSet {
    pub id: i32,
    pub name: String,

    base_price: i32,
    solo_price: i32,

    pub count_laufende: CountLaufende,
    pub min_laufende_incl: i32,
    pub max_laufende_incl: i32,
    pub laufende_price: i32,

    pub geier_allowed: bool,
    pub hochzeit_allowed: bool,
    pub bettel_allowed: bool,
    pub ramsch_allowed: bool,
    pub farb_wenz_allowed: bool,
    pub farb_geier_allowed: bool,
}

impl RuleSet {
    pub fn new(id: i32, base_price: i32, count_laufende: CountLaufende) -> RuleSet {
        RuleSet {
            id,
            name: format!("RS{}", &id),
            base_price,
            solo_price: 3 * base_price,
            count_laufende,
            min_laufende_incl: 2,
            max_laufende_incl: 4,
            laufende_price: base_price,
            geier_allowed: false,
            hochzeit_allowed: false,
            bettel_allowed: false,
            ramsch_allowed: false,
            farb_wenz_allowed: false,
            farb_geier_allowed: false,
        }
    }

    pub fn get_base_price(&self) -> &i32 {
        return &self.base_price;
    }

    pub fn get_solo_price(&self) -> &i32 {
        return &self.solo_price;
    }
}

pub fn select_rule_set_ids(conn: &PgConnection) -> QueryResult<Vec<i32>> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.select(id).load(conn)
}

#[deprecated]
pub fn select_rule_sets(conn: &PgConnection) -> QueryResult<Vec<RuleSet>> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.load(conn)
}

pub fn select_rule_set_by_id(conn: &PgConnection, id: &i32) -> QueryResult<RuleSet> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.find(id).first(conn)
}
