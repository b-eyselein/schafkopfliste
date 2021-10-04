use std::convert::TryFrom;

use diesel::{prelude::*, PgConnection, QueryResult};
use juniper::{graphql_object, FieldResult};
use serde::Serialize;

use crate::graphql::{graphql_on_db_error, GraphQLContext};
use crate::models::player::{select_player_count_for_group, select_players_in_group, Player};
use crate::models::rule_set::{select_rule_set_by_id, select_rule_sets, RuleSet};
use crate::models::session::{select_session_by_id, select_sessions_for_group, Session};

#[derive(Debug, Serialize, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct Group {
    pub id: i32,
    pub owner_username: String,
    pub name: String,
}

// GraphQL

#[graphql_object(Context = GraphQLContext)]
impl Group {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub async fn rule_sets(&self, context: &GraphQLContext) -> FieldResult<Vec<RuleSet>> {
        let group_id = self.id.clone();

        Ok(context.connection.run(move |c| select_rule_sets(&c, &group_id)).await?)
    }

    pub async fn rule_set(&self, name: String, context: &GraphQLContext) -> FieldResult<Option<RuleSet>> {
        let group_id = self.id.clone();

        Ok(context.connection.run(move |c| select_rule_set_by_id(&c, &group_id, &name)).await?)
    }

    pub async fn player_count(&self, context: &GraphQLContext) -> FieldResult<i32> {
        let group_id = self.id.clone();

        let count = context
            .connection
            .run(move |c| select_player_count_for_group(&c, &group_id).map_err(graphql_on_db_error))
            .await?;

        Ok(i32::try_from(count)?)
    }

    pub async fn players(&self, context: &GraphQLContext) -> FieldResult<Vec<Player>> {
        let group_id = self.id.clone();

        Ok(context.connection.run(move |c| select_players_in_group(&c, &group_id)).await?)
    }

    pub async fn sessions(&self, context: &GraphQLContext) -> FieldResult<Vec<Session>> {
        let group_id = self.id.clone();

        Ok(context.connection.run(move |c| select_sessions_for_group(&c, &group_id)).await?)
    }

    pub async fn session(&self, id: i32, context: &GraphQLContext) -> FieldResult<Option<Session>> {
        let group_id = self.id.clone();

        Ok(context.connection.run(move |c| select_session_by_id(&c, &group_id, &id)).await?)
    }
}

// Queries

pub fn select_groups(conn: &PgConnection) -> QueryResult<Vec<Group>> {
    use crate::schema::groups::dsl::*;

    groups.load(conn)
}

pub fn select_group_by_id(conn: &PgConnection, the_id: &i32) -> QueryResult<Option<Group>> {
    use crate::schema::groups::dsl::*;

    groups.filter(id.eq(the_id)).first(conn).optional()
}

pub fn select_groups_for_username(conn: &PgConnection, username: &str) -> QueryResult<Vec<Group>> {
    use crate::schema::groups::dsl::*;

    groups.filter(owner_username.eq(username)).load(conn)
}

pub fn insert_group(conn: &PgConnection, the_owner_username: &str, the_name: &str) -> QueryResult<i32> {
    use crate::schema::groups::dsl::*;

    diesel::insert_into(groups)
        .values(&(owner_username.eq(the_owner_username), name.eq(the_name)))
        .returning(id)
        .get_result(conn)
}
