use chrono::NaiveDate;
use diesel::{self, prelude::*, PgConnection};
use serde::{Deserialize, Serialize};

use crate::models::game::{select_rule_set_by_id, RuleSet};
use crate::models::player::{select_player_by_id, Player};
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

#[derive(Debug, Serialize, Queryable, Insertable)]
#[serde(rename_all = "camelCase")]
pub struct Session {
    serial_number: i32,
    group_id: i32,
    date: NaiveDate,
    first_player_id: i32,
    second_player_id: i32,
    third_player_id: i32,
    fourth_player_id: i32,
    rule_set_id: i32,
}

impl Session {
    fn from_creatable_session(serial_number: i32, group_id: i32, cs: CreatableSession) -> Session {
        let CreatableSession {
            date,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
            rule_set_id,
        } = cs;

        Session {
            serial_number,
            group_id,
            date,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
            rule_set_id,
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionWithPlayersAndRuleSet {
    serial_number: i32,
    group_id: i32,
    date: NaiveDate,
    first_player: Player,
    second_player: Player,
    third_player: Player,
    fourth_player: Player,
    rule_set: RuleSet,
}

impl SessionWithPlayersAndRuleSet {
    pub fn from_db_values(
        session: Session,
        first_player: Player,
        second_player: Player,
        third_player: Player,
        fourth_player: Player,
        rule_set: RuleSet,
    ) -> SessionWithPlayersAndRuleSet {
        SessionWithPlayersAndRuleSet {
            serial_number: session.serial_number,
            date: session.date,
            group_id: session.group_id,
            first_player,
            second_player,
            third_player,
            fourth_player,
            rule_set,
        }
    }
}

pub fn select_session_by_id(
    conn: &PgConnection,
    the_group_id: i32,
    the_serial_number: i32,
) -> Option<Session> {
    use crate::schema::sessions::dsl::*;

    sessions
        .filter(
            group_id
                .eq(the_group_id)
                .and(serial_number.eq(the_serial_number)),
        )
        .first::<Session>(conn)
        .ok()
}

pub fn select_session_with_players_and_rule_set_by_id(
    conn: &PgConnection,
    the_group_id: i32,
    the_serial_number: i32,
) -> Option<SessionWithPlayersAndRuleSet> {
    let session = select_session_by_id(conn, the_group_id, the_serial_number)?;

    println!("{:?}", session);

    let first_player = select_player_by_id(conn, session.first_player_id)?;
    let second_player = select_player_by_id(conn, session.second_player_id)?;
    let third_player = select_player_by_id(conn, session.third_player_id)?;
    let fourth_player = select_player_by_id(conn, session.fourth_player_id)?;

    let rule_set = select_rule_set_by_id(conn, session.rule_set_id)?;

    Some(SessionWithPlayersAndRuleSet::from_db_values(
        session,
        first_player,
        second_player,
        third_player,
        fourth_player,
        rule_set,
    ))
}

pub fn insert_session(
    conn: &PgConnection,
    group_id: i32,
    cs: CreatableSession,
) -> Result<Session, String> {
    let maybe_max_serial_number = sessions::table
        .filter(sessions::group_id.eq(group_id))
        .select(diesel::dsl::max(sessions::serial_number))
        .first::<Option<i32>>(conn)
        .map_err(|_| -> String { "Error while querying serial for new session".into() })?;

    let serial_number = maybe_max_serial_number.map(|v| v + 1).unwrap_or(0);

    diesel::insert_into(sessions::table)
        .values(Session::from_creatable_session(serial_number, group_id, cs))
        .returning(sessions::all_columns)
        .get_result(conn)
        .map_err(|_| "Error while inserting session into db".into())
}
