use diesel::{prelude::*, PgConnection, QueryResult};
use juniper::{GraphQLEnum, GraphQLInputObject, GraphQLObject};
use serde::{Deserialize, Serialize};

use crate::schema::rule_sets;

#[derive(Debug, PartialEq, DbEnum, GraphQLEnum, Serialize, Deserialize)]
#[DieselType = "Count_laufende"]
pub enum CountLaufende {
    Always,
    OnlyLosers,
    Never
}

#[derive(Debug, Queryable, GraphQLObject, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RuleSet {
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
    pub farb_geier_allowed: bool
}

impl RuleSet {
    pub fn new(id: i32, base_price: i32, count_laufende: CountLaufende) -> RuleSet {
        RuleSet {
            name: format!("RS_{}", &id),
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
            farb_geier_allowed: false
        }
    }

    pub fn get_base_price(&self) -> &i32 {
        &self.base_price
    }

    pub fn get_solo_price(&self) -> &i32 {
        &self.solo_price
    }
}

// GraphQL

#[derive(Debug, GraphQLInputObject, Insertable)]
#[table_name = "rule_sets"]
pub struct RuleSetInput {
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
    pub farb_geier_allowed: bool
}

// Queries

pub fn insert_rule_set(conn: &PgConnection, rule_set_input: &RuleSetInput) -> QueryResult<usize> {
    diesel::insert_into(rule_sets::table).values(rule_set_input).execute(conn)
}

pub fn select_rule_sets(conn: &PgConnection) -> QueryResult<Vec<RuleSet>> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.load(conn)
}

pub fn select_rule_set_by_id(conn: &PgConnection, rule_set_name: &str) -> QueryResult<Option<RuleSet>> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.find(rule_set_name).first(conn).optional()
}

pub fn select_rule_set_for_group(conn: &PgConnection, the_group_name: &str) -> QueryResult<Option<RuleSet>> {
    use crate::schema::groups;
    use crate::schema::rule_sets::dsl::*;

    groups::table
        .filter(groups::name.eq(the_group_name))
        .inner_join(rule_sets)
        .select(rule_sets::all_columns())
        .first(conn)
        .optional()
}
