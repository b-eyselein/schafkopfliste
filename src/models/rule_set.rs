use diesel::{self, prelude::*, PgConnection};
use serde::{Deserialize, Serialize};

use crate::schema::rule_sets;

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum)]
#[DieselType = "Count_laufende"]
pub enum CountLaufende {
    Always,
    OnlyLosers,
    Never,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable)]
#[serde(rename_all = "camelCase")]
pub struct RuleSet {
    pub id: i32,
    pub name: String,
    pub base_price: i32,
    pub solo_price: i32,
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

pub fn get_rule_sets(conn: &PgConnection) -> Vec<RuleSet> {
    rule_sets::table.load::<RuleSet>(conn).unwrap_or(Vec::new())
}

pub fn select_rule_set_by_id(conn: &PgConnection, id: &i32) -> Option<RuleSet> {
    rule_sets::table.find(id).first(conn).ok()
}
