use diesel;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::schema::rule_sets;
use crate::DbConn;

#[allow(dead_code)]
pub enum Suit {
    Acorns,
    Leaves,
    Hearts,
    Bells,
}

#[allow(dead_code)]
pub enum GameType {
    Ruf { suit: Suit },
    Wenz,
    FarbSolo { suit: Suit },
    Geier,
    Hochzeit,
    Bettel,
    Ramsch,
    FarbWenz { suit: Suit },
    FarbGeier { suit: Suit },
}

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
    pub count_laufende: CountLaufende,
    pub geier_allowed: bool,
    pub hochzeit_allowed: bool,
    pub bettel_allowed: bool,
    pub ramsch_allowed: bool,
    pub farb_wenz_allowed: bool,
    pub farb_geier_allowed: bool,
}

pub fn get_rule_sets(conn: DbConn) -> Vec<RuleSet> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.load::<RuleSet>(&conn.0).unwrap_or(Vec::new())
}
