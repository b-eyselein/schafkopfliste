use diesel::prelude::*;
use juniper::GraphQLObject;

#[derive(Debug, Queryable, GraphQLObject)]
pub struct Player {
    #[graphql(skip)]
    pub group_id: i32,
    pub nickname: String,
    pub first_name: String,
    pub last_name: String,
    pub balance: i32,
    pub game_count: i32,
    pub put_count: i32,
    pub played_games: i32,
    pub win_count: i32,
}

// Queries

pub fn select_player_count_for_group(conn: &PgConnection, the_group_id: &i32) -> QueryResult<i64> {
    use crate::schema::players::dsl::*;

    players.filter(group_id.eq(the_group_id)).count().first(conn)
}

pub fn select_players_in_group(conn: &PgConnection, the_group_id: &i32) -> QueryResult<Vec<Player>> {
    use crate::schema::players::dsl::*;

    players.filter(group_id.eq(the_group_id)).load(conn)
}

pub fn select_player_by_nickname(conn: &PgConnection, the_group_id: &i32, the_nickname: &str) -> QueryResult<Option<Player>> {
    use crate::schema::players::dsl::*;

    players
        .filter(group_id.eq(the_group_id))
        .filter(nickname.eq(the_nickname))
        .first(conn)
        .optional()
}

pub fn insert_player(conn: &PgConnection, the_group_id: &i32, the_nickname: &str, the_first_name: &str, the_last_name: &str) -> QueryResult<String> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players)
        .values((
            group_id.eq(the_group_id),
            nickname.eq(the_nickname),
            first_name.eq(the_first_name),
            last_name.eq(the_last_name),
        ))
        .returning(nickname)
        .get_result(conn)
}
