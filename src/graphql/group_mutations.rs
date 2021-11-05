use chrono::{NaiveDate, NaiveTime};
use juniper::{graphql_object, FieldError, FieldResult, GraphQLInputObject};

use crate::graphql::mutation::on_no_login;
use crate::graphql::session_mutations::SessionMutations;
use crate::graphql::{on_insufficient_rights, GraphQLContext};
use crate::models::player::insert_player;
use crate::models::rule_set::{insert_rule_set, CountLaufende};
use crate::models::session::{insert_session, select_session_by_id, Session};
use crate::models::user::User;

pub struct GroupMutations {
    group_id: i32,
    owner_username: String,
    other_admin_usernames: Vec<String>,
}

impl GroupMutations {
    pub fn new(group_id: i32, owner_username: String, other_admin_usernames: Vec<String>) -> Self {
        Self {
            group_id,
            owner_username,
            other_admin_usernames,
        }
    }

    pub fn has_admin_rights(&self, username: &str) -> bool {
        self.owner_username == username || self.other_admin_usernames.iter().any(|x| x == username)
    }
}

#[derive(Debug, GraphQLInputObject)]
pub struct RuleSetInput {
    name: String,

    base_price: i32,
    solo_price: i32,

    count_laufende: CountLaufende,
    min_laufende_incl: i32,
    max_laufende_incl: i32,
    laufende_price: i32,

    geier_allowed: bool,
    hochzeit_allowed: bool,
    bettel_allowed: bool,
    ramsch_allowed: bool,
    farb_wenz_allowed: bool,
    farb_geier_allowed: bool,
}

#[derive(Debug, GraphQLInputObject)]
pub struct PlayerInput {
    nickname: String,
    name: Option<String>,
}

#[derive(Debug, GraphQLInputObject)]
pub struct SessionInput {
    date: NaiveDate,
    time: NaiveTime,
    rule_set_name: String,
    first_player_nickname: String,
    second_player_nickname: String,
    third_player_nickname: String,
    fourth_player_nickname: String,
}

#[graphql_object(context = GraphQLContext)]
impl GroupMutations {
    pub async fn create_rule_set(&self, rule_set_input: RuleSetInput, context: &GraphQLContext) -> FieldResult<String> {
        let User { username, .. } = context.check_user_login()?;

        if self.has_admin_rights(username) {
            let group_id = self.group_id;

            let RuleSetInput {
                name,
                base_price,
                solo_price,
                count_laufende,
                min_laufende_incl,
                max_laufende_incl,
                laufende_price,
                geier_allowed,
                hochzeit_allowed,
                bettel_allowed,
                ramsch_allowed,
                farb_wenz_allowed,
                farb_geier_allowed,
            } = rule_set_input;

            Ok(context
                .connection
                .run(move |c| {
                    insert_rule_set(
                        c,
                        &group_id,
                        &name,
                        &base_price,
                        &solo_price,
                        &count_laufende,
                        &min_laufende_incl,
                        &max_laufende_incl,
                        &laufende_price,
                        &geier_allowed,
                        &hochzeit_allowed,
                        &bettel_allowed,
                        &ramsch_allowed,
                        &farb_wenz_allowed,
                        &farb_geier_allowed,
                    )
                })
                .await?)
        } else {
            Err(on_insufficient_rights())
        }
    }

    pub async fn create_player(&self, new_player: PlayerInput, context: &GraphQLContext) -> FieldResult<String> {
        let User { username, .. } = context.check_user_login()?;

        if self.has_admin_rights(username) {
            let group_id = self.group_id;

            let PlayerInput { nickname, name } = new_player;

            Ok(context.connection.run(move |c| insert_player(c, &group_id, &nickname, &name)).await?)
        } else {
            Err(on_insufficient_rights())
        }
    }

    pub async fn new_session(&self, session_input: SessionInput, context: &GraphQLContext) -> FieldResult<i32> {
        let User { username, .. } = context.check_user_login()?;

        if self.has_admin_rights(username) {
            let group_id = self.group_id;

            let creator_username = if username == &self.owner_username { None } else { Some(username.to_string()) };

            // FIXME: check if user is owner of group...

            let SessionInput {
                date,
                time,
                rule_set_name,
                first_player_nickname,
                second_player_nickname,
                third_player_nickname,
                fourth_player_nickname,
            } = session_input;

            Ok(context
                .connection
                .run(move |c| {
                    insert_session(
                        c,
                        group_id,
                        &date,
                        &time,
                        &rule_set_name,
                        &first_player_nickname,
                        &second_player_nickname,
                        &third_player_nickname,
                        &fourth_player_nickname,
                        creator_username,
                    )
                })
                .await?)
        } else {
            Err(on_no_login())
        }
    }

    pub async fn session(&self, session_id: i32, context: &GraphQLContext) -> FieldResult<SessionMutations> {
        let User { username, .. } = context.check_user_login()?;

        let group_id = self.group_id;

        if self.has_admin_rights(username) {
            match context.connection.run(move |c| select_session_by_id(c, &group_id, &session_id)).await? {
                Some(Session { group_id, id, .. }) => Ok(SessionMutations::new(group_id, id)),
                None => Err(FieldError::from("No such session!")),
            }
        } else {
            Err(on_no_login())
        }
    }
}
