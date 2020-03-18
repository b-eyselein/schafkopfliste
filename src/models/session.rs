use juniper::FieldResult;
use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::game::{select_games_for_session, Game};
use crate::schema::sessions;

use super::group::Group;

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
    pub id: i32,
    pub group_id: i32,

    pub date_year: i32,
    pub date_month: i32,
    pub date_day_of_month: i32,
    pub time_hours: i32,
    pub time_minutes: i32,

    pub has_ended: bool,

    pub first_player_id: i32,
    pub second_player_id: i32,
    pub third_player_id: i32,
    pub fourth_player_id: i32,

    pub creator_username: String,
}

impl Session {
    pub fn from_creatable_session(
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
            creator_username,
        }
    }

    pub fn player_has_partaken(&self, player_id: &i32) -> bool {
        self.first_player_id == *player_id
            || self.second_player_id == *player_id
            || self.third_player_id == *player_id
            || self.fourth_player_id == *player_id
    }
}

#[juniper::object(context = GraphQLContext)]
impl Session {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn date(&self) -> String {
        format!(
            "{}.{}.{}",
            self.date_day_of_month, self.date_month, self.date_year
        )
    }

    pub fn games(&self, context: &GraphQLContext) -> FieldResult<Vec<Game>> {
        select_games_for_session(&context.connection.0, &self.id, &self.group_id)
            .map_err(graphql_on_db_error)
    }
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![CreatableSession::ts_type(), Session::ts_type()]
}
