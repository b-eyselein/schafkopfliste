use diesel::{prelude::*, PgConnection, QueryResult};
use juniper::{graphql_object, FieldError, FieldResult, GraphQLInputObject};

use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::game::{select_games_for_session, Game};
use crate::models::player::{select_player_by_nickname, Player};
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

    pub first_player_nickname: String,
    pub second_player_nickname: String,
    pub third_player_nickname: String,
    pub fourth_player_nickname: String,

    pub creator_username: String,
}

impl Session {
    pub fn from_creatable_session(id: i32, group_name: String, creator_username: String, cs: SessionInput) -> Session {
        let SessionInput {
            date_year,
            date_month,
            date_day_of_month,
            time_hours,
            time_minutes,
            first_player_nickname,
            second_player_nickname,
            third_player_nickname,
            fourth_player_nickname,
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
            first_player_nickname,
            second_player_nickname,
            third_player_nickname,
            fourth_player_nickname,
            creator_username,
        }
    }

    pub fn player_has_partaken(&self, player_nickname: &str) -> bool {
        self.first_player_nickname == *player_nickname
            || self.second_player_nickname == *player_nickname
            || self.third_player_nickname == *player_nickname
            || self.fourth_player_nickname == *player_nickname
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

    first_player_nickname: String,
    second_player_nickname: String,
    third_player_nickname: String,
    fourth_player_nickname: String,
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

    pub async fn games(&self, context: &GraphQLContext) -> FieldResult<Vec<Game>> {
        let session_id = self.id.clone();
        let group_name = self.group_name.clone();

        Ok(context
            .connection
            .run(move |c| select_games_for_session(&c, &session_id, &group_name).map_err(graphql_on_db_error))
            .await?)
    }

    pub async fn rule_set(&self, context: &GraphQLContext) -> FieldResult<RuleSet> {
        let group_name = self.group_name.clone();

        Ok(context
            .connection
            .run(move |c| select_rule_set_for_group(&c, &group_name)?.ok_or_else(|| FieldError::from("No rule set found!")))
            .await?)
    }

    pub async fn first_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let first_player_nickname = self.first_player_nickname.clone();

        Ok(context.connection.run(move |c| select_player_by_nickname(&c, &first_player_nickname)).await?)
    }

    pub async fn second_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let second_player_nickname = self.second_player_nickname.clone();

        Ok(context.connection.run(move |c| select_player_by_nickname(&c, &second_player_nickname)).await?)
    }

    pub async fn third_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let third_player_nickname = self.third_player_nickname.clone();

        Ok(context.connection.run(move |c| select_player_by_nickname(&c, &third_player_nickname)).await?)
    }

    pub async fn fourth_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let fourth_player_nickname = self.fourth_player_nickname.clone();

        Ok(context.connection.run(move |c| select_player_by_nickname(&c, &fourth_player_nickname)).await?)
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
