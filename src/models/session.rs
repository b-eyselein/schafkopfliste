use chrono::NaiveDate;
use diesel::{self, prelude::*, PgConnection};
use serde::{Deserialize, Serialize};

use crate::models::game::{select_games_for_session, PricedGame};
use crate::models::group::{select_group_by_id, Group};
use crate::models::player::{select_player_by_id, Player};
use crate::models::rule_set::{select_rule_set_by_id, RuleSet};
use crate::schema::sessions;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatableSession {
    pub date: NaiveDate,
    pub first_player_id: i32,
    pub second_player_id: i32,
    pub third_player_id: i32,
    pub fourth_player_id: i32,
    pub rule_set_id: i32,
}

#[derive(Debug, Serialize, Identifiable, Queryable, Insertable, Associations, PartialEq)]
#[serde(rename_all = "camelCase")]
#[belongs_to(Group)]
pub struct Session {
    id: i32,
    group_id: i32,
    date: NaiveDate,
    has_ended: bool,
    first_player_id: i32,
    second_player_id: i32,
    third_player_id: i32,
    fourth_player_id: i32,
    pub rule_set_id: i32,
    creator_username: String,
}

impl Session {
    fn from_creatable_session(
        id: i32,
        group_id: i32,
        creator_username: String,
        cs: CreatableSession,
    ) -> Session {
        let CreatableSession {
            date,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
            rule_set_id,
        } = cs;

        Session {
            id,
            group_id,
            date,
            has_ended: false,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
            rule_set_id,
            creator_username,
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CompleteSession {
    id: i32,
    group: Group,
    date: NaiveDate,
    first_player: Player,
    second_player: Player,
    third_player: Player,
    fourth_player: Player,
    rule_set: RuleSet,
    played_games: Vec<PricedGame>,
}

impl CompleteSession {
    pub fn from_db_values(
        id: i32,
        date: NaiveDate,
        group: Group,
        first_player: Player,
        second_player: Player,
        third_player: Player,
        fourth_player: Player,
        rule_set: RuleSet,
        played_games: Vec<PricedGame>,
    ) -> CompleteSession {
        CompleteSession {
            id,
            date,
            group,
            first_player,
            second_player,
            third_player,
            fourth_player,
            rule_set,
            played_games,
        }
    }
}

pub fn select_sessions_for_group(conn: &PgConnection, group_id: &i32) -> Vec<Session> {
    sessions::table
        .filter(sessions::group_id.eq(group_id))
        .load(conn)
        .unwrap_or(Vec::new())
}

pub fn select_session_by_id(conn: &PgConnection, group_id: &i32, id: &i32) -> Option<Session> {
    sessions::table.find((id, group_id)).first(conn).ok()
}

pub fn select_complete_session_by_id(
    conn: &PgConnection,
    the_group_id: &i32,
    the_serial_number: &i32,
) -> Option<CompleteSession> {
    let session = select_session_by_id(conn, the_group_id, the_serial_number)?;

    let games = select_games_for_session(conn, &session);

    Some(CompleteSession::from_db_values(
        session.id,
        session.date,
        select_group_by_id(conn, &session.group_id)?,
        select_player_by_id(conn, &session.first_player_id)?,
        select_player_by_id(conn, &session.second_player_id)?,
        select_player_by_id(conn, &session.third_player_id)?,
        select_player_by_id(conn, &session.fourth_player_id)?,
        select_rule_set_by_id(conn, &session.rule_set_id)?,
        games,
    ))
}

pub fn insert_session(
    conn: &PgConnection,
    group_id: i32,
    creator_username: String,
    cs: CreatableSession,
) -> Result<Session, String> {
    let maybe_max_id = sessions::table
        .filter(sessions::group_id.eq(group_id))
        .select(diesel::dsl::max(sessions::id))
        .first::<Option<i32>>(conn)
        .map_err(|_| -> String { "Error while querying serial for new session".into() })?;

    let id = maybe_max_id.map(|v| v + 1).unwrap_or(1);

    let session = Session::from_creatable_session(id, group_id, creator_username, cs);

    diesel::insert_into(sessions::table)
        .values(session)
        .returning(sessions::all_columns)
        .get_result(conn)
        .map_err(|_| "Error while inserting session into db".into())
}
