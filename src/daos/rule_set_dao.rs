use diesel::{prelude::*, PgConnection, QueryResult};

use crate::models::rule_set::RuleSet;

pub fn select_rule_sets(conn: &PgConnection) -> QueryResult<Vec<RuleSet>> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.load(conn)
}

pub fn select_rule_set_by_id(conn: &PgConnection, the_id: &i32) -> QueryResult<RuleSet> {
    use crate::schema::rule_sets::dsl::*;

    rule_sets.find(the_id).first(conn)
}
