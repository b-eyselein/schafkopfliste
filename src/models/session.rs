use chrono::{Datelike, NaiveDate, NaiveTime};
use diesel::{prelude::*, PgConnection, QueryResult};
use juniper::{graphql_object, FieldError, FieldResult};

use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::game::{select_games_for_session, Game};
use crate::models::player::{select_player_by_nickname, Player};
use crate::models::rule_set::{select_rule_set_by_id, RuleSet};
use crate::schema::sessions;

#[derive(Debug, Queryable, Insertable)]
pub struct Session {
    pub group_id: i32,
    pub id: i32,

    date: NaiveDate,
    time: NaiveTime,

    rule_set_name: String,

    has_ended: bool,

    first_player_nickname: String,
    second_player_nickname: String,
    third_player_nickname: String,
    fourth_player_nickname: String,

    other_creator_username: Option<String>,
}

// GraphQL

#[graphql_object(context = GraphQLContext)]
impl Session {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn has_ended(&self) -> &bool {
        &self.has_ended
    }

    pub fn date(&self) -> String {
        format!("{}.{}.{}", self.date.day0(), self.date.month0(), self.date.year())
    }

    pub async fn games(&self, context: &GraphQLContext) -> FieldResult<Vec<Game>> {
        let session_id = self.id;
        let group_id = self.group_id;

        context
            .connection
            .run(move |c| select_games_for_session(c, &group_id, &session_id).map_err(graphql_on_db_error))
            .await
    }

    pub async fn rule_set(&self, context: &GraphQLContext) -> FieldResult<RuleSet> {
        let group_id = self.group_id;
        let rule_set_name = self.rule_set_name.clone();

        context
            .connection
            .run(move |c| select_rule_set_by_id(c, &group_id, &rule_set_name)?.ok_or_else(|| FieldError::from("No rule set found!")))
            .await
    }

    pub async fn first_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let group_id = self.group_id;
        let first_player_nickname = self.first_player_nickname.clone();

        Ok(context
            .connection
            .run(move |c| select_player_by_nickname(c, &group_id, &first_player_nickname))
            .await?
            .unwrap())
    }

    pub async fn second_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let group_id = self.group_id;
        let second_player_nickname = self.second_player_nickname.clone();

        Ok(context
            .connection
            .run(move |c| select_player_by_nickname(c, &group_id, &second_player_nickname))
            .await?
            .unwrap())
    }

    pub async fn third_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let group_id = self.group_id;
        let third_player_nickname = self.third_player_nickname.clone();

        Ok(context
            .connection
            .run(move |c| select_player_by_nickname(c, &group_id, &third_player_nickname))
            .await?
            .unwrap())
    }

    pub async fn fourth_player(&self, context: &GraphQLContext) -> FieldResult<Player> {
        let group_id = self.group_id;
        let fourth_player_nickname = self.fourth_player_nickname.clone();

        Ok(context
            .connection
            .run(move |c| select_player_by_nickname(c, &group_id, &fourth_player_nickname))
            .await?
            .unwrap())
    }
}

// Queries

fn select_max_session_id(conn: &PgConnection, the_group_id: &i32) -> QueryResult<i32> {
    use crate::schema::sessions::dsl::*;
    use diesel::dsl::max;

    sessions
        .filter(group_id.eq(the_group_id))
        .select(max(id))
        .first::<Option<i32>>(conn)
        .map(|maybe_max| maybe_max.unwrap_or(0))
}

#[allow(clippy::too_many_arguments)]
pub fn insert_session(
    conn: &PgConnection,
    the_group_id: i32,
    the_date: &NaiveDate,
    the_time: &NaiveTime,
    the_rule_set_name: &str,
    the_first_player_nickname: &str,
    the_second_player_nickname: &str,
    the_third_player_nickname: &str,
    the_fourth_player_nickname: &str,
    the_other_creator_username: Option<String>,
) -> QueryResult<i32> {
    use crate::schema::sessions::dsl::*;

    let new_id = select_max_session_id(conn, &the_group_id)? + 1;

    diesel::insert_into(sessions)
        .values((
            group_id.eq(the_group_id),
            id.eq(new_id),
            date.eq(the_date),
            time.eq(the_time),
            rule_set_name.eq(the_rule_set_name),
            first_player_nickname.eq(the_first_player_nickname),
            second_player_nickname.eq(the_second_player_nickname),
            third_player_nickname.eq(the_third_player_nickname),
            fourth_player_nickname.eq(the_fourth_player_nickname),
            other_creator_username.eq(the_other_creator_username),
        ))
        .returning(id)
        .get_result(conn)
}

pub fn select_sessions_for_group(conn: &PgConnection, the_group_id: &i32) -> QueryResult<Vec<Session>> {
    use crate::schema::sessions::dsl::*;

    sessions.filter(group_id.eq(the_group_id)).order_by(id).load(conn)
}

pub fn select_session_by_id(conn: &PgConnection, the_group_id: &i32, the_id: &i32) -> QueryResult<Option<Session>> {
    use crate::schema::sessions::dsl::*;

    sessions.find((the_group_id, the_id)).first(conn).optional()
}

/*
pub fn select_session_has_ended(conn: &PgConnection, the_group_name: &str, the_id: &i32) -> QueryResult<bool> {
use crate::schema::sessions::dsl::*;

    sessions.find((the_id, the_group_name)).select(has_ended).first(conn)
}
 */

pub fn update_end_session(conn: &PgConnection, the_group_id: &i32, the_session_id: &i32) -> QueryResult<bool> {
    use crate::schema::sessions::dsl::*;

    let source = sessions.filter(group_id.eq(the_group_id)).filter(id.eq(the_session_id));

    diesel::update(source).set(has_ended.eq(true)).returning(has_ended).get_result(conn)
}
