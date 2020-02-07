use serde::{Deserialize, Serialize};

use crate::schema::rule_sets;

pub enum Suit {
    Acorns,
    Leaves,
    Hearts,
    Bells,
}

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

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable)]
#[serde(rename_all = "camelCase")]
pub struct RuleSet {
    pub id: i32,
    pub name: String,
    pub geier_allowed: bool,
    pub hochzeit_allowed: bool,
    pub bettel_allowed: bool,
    pub ramsch_allowed: bool,
    pub farb_wenz_allowed: bool,
    pub farb_geier_allowed: bool,
}
