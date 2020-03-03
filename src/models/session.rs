use diesel::{self, prelude::*, PgConnection};
use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::models::game::PricedGame;
use crate::schema::sessions;

use super::game_dao::select_games_for_session;
use super::group::{select_group_by_id, Group};
use super::player::{select_player_by_id, Player};
use super::rule_set::{select_rule_set_by_id, RuleSet};

#[derive(Debug, Serialize, Deserialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct CreatableSession {
    date_year: i32,
    date_month: i32,
    date_day_of_month: i32,
    time_hours: i32,
    time_minutes: i32,
    first_player_id: i32,
    second_player_id: i32,
    third_player_id: i32,
    fourth_player_id: i32,
    rule_set_id: i32,
}

#[derive(
    Debug,
    Deserialize,
    Serialize,
    Identifiable,
    Queryable,
    Insertable,
    Associations,
    PartialEq,
    HasTypescriptType,
)]
#[serde(rename_all = "camelCase")]
#[belongs_to(Group)]
pub struct Session {
    id: i32,
    group_id: i32,

    has_ended: bool,
    first_player_id: i32,
    second_player_id: i32,
    third_player_id: i32,
    fourth_player_id: i32,
    rule_set_id: i32,

    creator_username: String,

    date_year: i32,
    date_month: i32,
    date_day_of_month: i32,
    time_hours: i32,
    time_minutes: i32,
}

impl Session {
    fn from_creatable_session(
        id: i32,
        group_id: i32,
        creator_username: String,
        cs: CreatableSession,
    ) -> Session {
        let CreatableSession {
            date_year,
            date_month,
            date_day_of_month,
            time_hours,
            time_minutes,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
            rule_set_id,
        } = cs;

        Session {
            id,
            group_id,
            date_year,
            date_month,
            date_day_of_month,
            time_hours,
            time_minutes,
            has_ended: false,
            first_player_id,
            second_player_id,
            third_player_id,
            fourth_player_id,
            rule_set_id,
            creator_username,
        }
    }

    pub fn rule_set_id(&self) -> &i32 {
        &self.rule_set_id
    }
}

#[derive(Debug, Serialize, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct CompleteSession {
    id: i32,
    group: Group,
    date_year: i32,
    date_month: i32,
    date_day_of_month: i32,
    time_hours: i32,
    time_minutes: i32,
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
        date_year: i32,
        date_month: i32,
        date_day_of_month: i32,
        time_hours: i32,
        time_minutes: i32,
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
            date_year,
            date_month,
            date_day_of_month,
            time_hours,
            time_minutes,
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
        .order_by(sessions::id)
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

    let rule_set = select_rule_set_by_id(conn, &session.rule_set_id)?;

    let games = select_games_for_session(conn, &session)
        .into_iter()
        .map(|game| {
            let price = &game.calculate_price(&rule_set);

            PricedGame::new(game, *price)
        })
        .collect();

    Some(CompleteSession::from_db_values(
        session.id,
        session.date_year,
        session.date_month,
        session.date_day_of_month,
        session.time_hours,
        session.time_minutes,
        select_group_by_id(conn, &session.group_id)?,
        select_player_by_id(conn, &session.first_player_id)?,
        select_player_by_id(conn, &session.second_player_id)?,
        select_player_by_id(conn, &session.third_player_id)?,
        select_player_by_id(conn, &session.fourth_player_id)?,
        rule_set,
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
        .map_err(|err| {
            let base_error_msg = "Error while inserting session into db";
            println!("{}: {}", base_error_msg, err);
            base_error_msg.into()
        })
}
