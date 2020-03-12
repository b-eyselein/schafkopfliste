use diesel::{self, pg::PgConnection, prelude::*, result::QueryResult};

use super::game::Game;

pub fn upsert_game(conn: &PgConnection, the_game: &Game) -> QueryResult<Game> {
    use crate::schema::games::dsl::*;

    diesel::insert_into(games)
        .values(the_game)
        .on_conflict((id, session_id, group_id))
        .do_update()
        .set(the_game)
        //.returning(games::all_columns)
        .get_result(conn)
}

pub fn select_games_for_group(conn: &PgConnection, the_group_id: i32) -> QueryResult<Vec<Game>> {
    use crate::schema::games::dsl::*;

    games.filter(group_id.eq(the_group_id)).load(conn)
}

pub fn select_games_for_session(
    conn: &PgConnection,
    the_session_id: &i32,
    the_group_id: &i32,
) -> QueryResult<Vec<Game>> {
    use crate::schema::games::dsl::*;

    games
        .filter(session_id.eq(the_session_id))
        .filter(group_id.eq(the_group_id))
        .order_by(id)
        .load(conn)
}
