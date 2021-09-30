use diesel::{prelude::*, PgConnection};
use juniper::{graphql_object, FieldResult};

use crate::graphql::GraphQLContext;
use crate::models::player::select_player_by_nickname;
use crate::schema::player_in_groups;

#[derive(Queryable, Insertable)]
pub struct PlayerInGroup {
    group_name: String,
    player_nickname: String,
    balance: i32,
    game_count: i32,
    put_count: i32,
    played_games: i32,
    win_count: i32,
    is_active: bool,
}

impl PlayerInGroup {
    pub fn new(group_name: String, player_nickname: String, is_active: bool) -> PlayerInGroup {
        PlayerInGroup {
            group_name,
            player_nickname,
            balance: 0,
            game_count: 0,
            put_count: 0,
            played_games: 0,
            win_count: 0,
            is_active,
        }
    }
}

// GraphQL

#[graphql_object(context = GraphQLContext)]
impl PlayerInGroup {
    pub fn nickname(&self) -> &str {
        &self.player_nickname
    }

    pub async fn name(&self, context: &GraphQLContext) -> FieldResult<String> {
        // FIXME: remove this query!
        let player_nickname = self.player_nickname.clone();

        Ok(context
            .connection
            .run(move |c| select_player_by_nickname(&c, &player_nickname).map(|player| format!("{} {}", player.first_name, player.last_name)))
            .await?)
    }

    pub fn balance(&self) -> &i32 {
        &self.balance
    }

    pub fn game_count(&self) -> &i32 {
        &self.game_count
    }

    pub fn put_count(&self) -> &i32 {
        &self.put_count
    }

    pub fn played_games(&self) -> &i32 {
        &self.played_games
    }

    pub fn win_count(&self) -> &i32 {
        &self.win_count
    }

    pub fn is_active(&self) -> &bool {
        &self.is_active
    }
}

// Queries

pub fn upsert_group_membership(conn: &PgConnection, the_group_name: String, the_player_nickname: String, new_state: bool) -> QueryResult<bool> {
    use crate::schema::player_in_groups::dsl::*;

    diesel::insert_into(player_in_groups)
        .values(PlayerInGroup::new(the_group_name, the_player_nickname, new_state))
        .on_conflict((player_nickname, group_name))
        .do_update()
        .set(is_active.eq(new_state))
        .returning(is_active)
        .get_result(conn)
}

pub fn select_group_membership_for_player(conn: &PgConnection, the_player_nickname: &str, the_group_name: &str) -> QueryResult<bool> {
    use crate::schema::player_in_groups::dsl::*;

    player_in_groups
        .filter(player_nickname.eq(the_player_nickname))
        .filter(group_name.eq(the_group_name))
        .select(is_active)
        .first(conn)
        .optional()
        .map(|maybe_is_active| maybe_is_active.unwrap_or(false))
}

pub fn select_players_in_group(conn: &PgConnection, the_group_name: &str) -> QueryResult<Vec<PlayerInGroup>> {
    use crate::schema::player_in_groups::dsl::*;

    // TODO: join with players to get name!

    player_in_groups.filter(group_name.eq(the_group_name)).filter(is_active.eq(true)).load(conn)
}
