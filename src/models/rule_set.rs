use diesel::prelude::*;
use juniper::{GraphQLEnum, GraphQLObject};
use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, DbEnum, GraphQLEnum, Serialize, Deserialize)]
#[DieselType = "Count_laufende"]
pub enum CountLaufende {
    Always,
    OnlyLosers,
    Never,
}

#[derive(Debug, Queryable, GraphQLObject)]
pub struct RuleSet {
    pub group_id: i32,
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

impl RuleSet {
    pub fn new(group_id: i32, id: i32, base_price: i32, count_laufende: CountLaufende) -> RuleSet {
        RuleSet {
            group_id,
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
            farb_geier_allowed: false,
        }
    }

    pub fn get_base_price(&self) -> &i32 {
        &self.base_price
    }

    pub fn get_solo_price(&self) -> &i32 {
        &self.solo_price
    }
}

// Queries

pub fn insert_rule_set(
    conn: &PgConnection,
    the_group_id: &i32,
    the_name: &str,
    the_base_price: &i32,
    the_solo_price: &i32,
    the_count_laufende: &CountLaufende,
    the_min_laufende_incl: &i32,
    the_max_laufende_incl: &i32,
    the_laufende_price: &i32,
    the_geier_allowed: &bool,
    the_hochzeit_allowed: &bool,
    the_bettel_alllowed: &bool,
    the_ramsch_allowed: &bool,
    the_farb_wenz_allowed: &bool,
    the_farb_geier_allowed: &bool,
) -> QueryResult<String> {
    use crate::schema::rule_sets::dsl::*;

    diesel::insert_into(rule_sets)
        .values((
            group_id.eq(the_group_id),
            name.eq(the_name),
            base_price.eq(the_base_price),
            solo_price.eq(the_solo_price),
            count_laufende.eq(the_count_laufende),
            min_laufende_incl.eq(the_min_laufende_incl),
            max_laufende_incl.eq(the_max_laufende_incl),
            laufende_price.eq(the_laufende_price),
            geier_allowed.eq(the_geier_allowed),
            hochzeit_allowed.eq(the_hochzeit_allowed),
            bettel_allowed.eq(the_bettel_alllowed),
            ramsch_allowed.eq(the_ramsch_allowed),
            farb_wenz_allowed.eq(the_farb_wenz_allowed),
            farb_geier_allowed.eq(the_farb_geier_allowed),
        ))
        .returning(name)
        .get_result(conn)
}

pub fn select_rule_sets(conn: &PgConnection, the_group_id: &i32) -> QueryResult<Vec<RuleSet>> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.filter(group_id.eq(the_group_id)).load(conn)
}

pub fn select_rule_set_by_id(conn: &PgConnection, the_group_id: &i32, the_rule_set_name: &str) -> QueryResult<Option<RuleSet>> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.find((the_group_id, the_rule_set_name)).first(conn).optional()
}

pub fn select_rule_set_for_session(conn: &PgConnection, the_group_id: &i32, the_session_id: &i32) -> QueryResult<Option<RuleSet>> {
    use crate::schema::rule_sets;
    use crate::schema::sessions;

    sessions::table
        .find((the_group_id, the_session_id))
        .inner_join(rule_sets::table.on(rule_sets::group_id.eq(sessions::group_id).and(rule_sets::name.eq(sessions::rule_set_name))))
        .select((rule_sets::all_columns))
        .first(conn)
        .optional()
}
