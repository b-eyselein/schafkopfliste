use diesel::{prelude::*, PgConnection, QueryResult};
use juniper::{graphql_object, FieldResult, GraphQLInputObject};

use crate::models::player_in_group::select_group_membership_for_player;
use crate::schema::players;
use crate::GraphQLContext;

#[derive(Debug, Queryable)]
pub struct Player {
    abbreviation: String,
    pub name: String,
    picture_name: Option<String>,
}

impl Player {
    pub fn new(abbreviation: String, name: String) -> Player {
        Player {
            abbreviation,
            name,
            picture_name: None,
        }
    }
}

// GraphQL

#[derive(Debug, Insertable, GraphQLInputObject)]
#[table_name = "players"]
pub struct PlayerInput {
    pub abbreviation: String,
    pub name: String,
    pub picture_name: Option<String>,
}

#[graphql_object(Context = GraphQLContext)]
impl Player {
    pub fn abbreviation(&self) -> &String {
        &self.abbreviation
    }

    pub fn name(&self) -> &String {
        &self.name
    }

    pub fn picture_name(&self) -> &Option<String> {
        &self.picture_name
    }

    pub fn is_member_in_group(
        &self,
        group_name: String,
        context: &GraphQLContext,
    ) -> FieldResult<bool> {
        let connection_mutex = context.connection.lock()?;

        Ok(select_group_membership_for_player(
            &connection_mutex.0,
            &self.abbreviation,
            &group_name,
        )?)
    }
}

// Queries

pub fn select_players(conn: &PgConnection) -> QueryResult<Vec<Player>> {
    use crate::schema::players::dsl::*;

    players.load(conn)
}

pub fn select_player_by_abbreviation(
    conn: &PgConnection,
    the_abbreviation: &str,
) -> QueryResult<Player> {
    use crate::schema::players::dsl::*;

    players
        .filter(abbreviation.eq(the_abbreviation))
        .first(conn)
}

pub fn insert_player(conn: &PgConnection, player_input: &PlayerInput) -> QueryResult<usize> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players)
        .values(player_input)
        .execute(conn)
}
