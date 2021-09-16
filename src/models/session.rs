use diesel::{prelude::*, PgConnection, QueryResult};
use juniper::{graphql_object, FieldError, FieldResult, GraphQLInputObject, Value};

use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::game::{select_games_for_session, Game};
use crate::models::player::{select_player_by_abbreviation, Player};
use crate::models::rule_set::{select_rule_set_for_group, RuleSet};
use crate::schema::sessions;

#[derive(Debug, Queryable, Insertable)]
pub struct Session {
    pub id: i32,
    pub group_name: String,

    pub date_year: i32,
    pub date_month: i32,
    pub date_day_of_month: i32,
    pub time_hours: i32,
    pub time_minutes: i32,

    pub has_ended: bool,

    pub first_player_abbreviation: String,
    pub second_player_abbreviation: String,
    pub third_player_abbreviation: String,
    pub fourth_player_abbreviation: String,

    pub creator_username: String
}

impl Session {
    pub fn from_creatable_session(id: i32, group_name: String, creator_username: String, cs: SessionInput) -> Session {
        let SessionInput {
            date_year,
            date_month,
            date_day_of_month,
            time_hours,
            time_minutes,
            first_player_abbreviation,
            second_player_abbreviation,
            third_player_abbreviation,
            fourth_player_abbreviation
        } = cs;

        Session {
            id,
            group_name,
            date_year,
            date_month,
            date_day_of_month,
            time_hours,
            time_minutes,
            has_ended: false,
            first_player_abbreviation,
            second_player_abbreviation,
            third_player_abbreviation,
            fourth_player_abbreviation,
            creator_username
        }
    }

    pub fn player_has_partaken(&self, player_abbreviation: &str) -> bool {
        self.first_player_abbreviation == *player_abbreviation
            || self.second_player_abbreviation == *player_abbreviation
            || self.third_player_abbreviation == *player_abbreviation
            || self.fourth_player_abbreviation == *player_abbreviation
    }
}

// GraphQL

#[derive(Debug, GraphQLInputObject)]
pub struct SessionInput {
    date_year: i32,
    date_month: i32,
    date_day_of_month: i32,
    time_hours: i32,
    time_minutes: i32,

    first_player_abbreviation: String,
    second_player_abbreviation: String,
    third_player_abbreviation: String,
    fourth_player_abbreviation: String
}

#[graphql_object(context = GraphQLContext)]
impl Session {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn has_ended(&self) -> &bool {
        &self.has_ended
    }

    pub fn date(&self) -> String {
        format!("{}.{}.{}", self.date_day_of_month, self.date_month, self.date_year)
    }

    pub fn games(&self, context: &GraphQLContext) -> FieldResult<Vec<Game>> {
        let connection_mutex = context.connection.lock()?;

        select_games_for_session(&connection_mutex.0, &self.id, &self.group_name).map_err(graphql_on_db_error)
    }

    pub fn rule_set(&self, context: &GraphQLContext) -> FieldResult<RuleSet> {
        let connection_mutex = context.connection.lock()?;

        select_rule_set_for_group(&connection_mutex.0, &self.group_name)?.ok_or_else(|| FieldError::new("No rule set found!", Value::null()))
    }

    pub fn first_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_player_by_abbreviation(&connection_mutex.0, &self.first_player_abbreviation)?)
    }

    pub fn second_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_player_by_abbreviation(&connection_mutex.0, &self.second_player_abbreviation)?)
    }

    pub fn third_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_player_by_abbreviation(&connection_mutex.0, &self.third_player_abbreviation)?)
    }

    pub fn fourth_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_player_by_abbreviation(&connection_mutex.0, &self.fourth_player_abbreviation)?)
    }
}

// Queries

fn select_max_session_id(conn: &PgConnection, the_group_name: &str) -> QueryResult<i32> {
    use crate::schema::sessions::dsl::*;
    use diesel::dsl::max;

    sessions
        .filter(group_name.eq(the_group_name))
        .select(max(id))
        .first::<Option<i32>>(conn)
        .map(|maybe_max| maybe_max.unwrap_or(0))
}

pub fn insert_session(conn: &PgConnection, the_group_name: String, the_creator_username: String, session_input: SessionInput) -> QueryResult<i32> {
    let new_id = select_max_session_id(conn, &the_group_name)? + 1;

    let session = Session::from_creatable_session(new_id, the_group_name, the_creator_username, session_input);

    diesel::insert_into(sessions::table).values(session).returning(sessions::id).get_result(conn)
}
