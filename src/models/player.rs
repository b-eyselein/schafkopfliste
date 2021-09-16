use diesel::{prelude::*, PgConnection, QueryResult};
use juniper::{graphql_object, FieldResult, GraphQLInputObject};

use crate::models::player_in_group::select_group_membership_for_player;
use crate::schema::players;
use crate::GraphQLContext;

#[derive(Debug, Queryable)]
pub struct Player {
    nickname: String,
    pub first_name: String,
    pub last_name: String,
    picture_name: Option<String>
}

impl Player {
    pub fn new(nickname: String, first_name: String, last_name: String) -> Player {
        Player {
            nickname,
            first_name,
            last_name,
            picture_name: None
        }
    }
}

// GraphQL

#[derive(Debug, Insertable, GraphQLInputObject)]
#[table_name = "players"]
pub struct PlayerInput {
    pub nickname: String,
    pub first_name: String,
    pub last_name: String,
    pub picture_name: Option<String>
}

#[graphql_object(Context = GraphQLContext)]
impl Player {
    pub fn nickname(&self) -> &String {
        &self.nickname
    }

    pub fn first_name(&self) -> &String {
        &self.first_name
    }

    pub fn last_name(&self) -> &String {
        &self.last_name
    }

    pub fn picture_name(&self) -> &Option<String> {
        &self.picture_name
    }

    pub fn is_member_in_group(&self, group_name: String, context: &GraphQLContext) -> FieldResult<bool> {
        Ok(select_group_membership_for_player(&context.connection.lock()?.0, &self.nickname, &group_name)?)
    }
}

// Queries

pub fn select_players(conn: &PgConnection) -> QueryResult<Vec<Player>> {
    use crate::schema::players::dsl::*;

    players.load(conn)
}

pub fn select_player_by_nickname(conn: &PgConnection, the_nickname: &str) -> QueryResult<Player> {
    use crate::schema::players::dsl::*;

    players.filter(nickname.eq(the_nickname)).first(conn)
}

pub fn insert_player(conn: &PgConnection, player_input: &PlayerInput) -> QueryResult<usize> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players).values(player_input).execute(conn)
}
