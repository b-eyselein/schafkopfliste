use diesel::{self, pg::PgConnection, prelude::*, result::Error as DbError};

use super::game::Game;
use super::session::Session;
use crate::schema::games;

pub fn insert_game(conn: &PgConnection, the_game: &Game) -> Result<Game, DbError> {
    diesel::insert_into(games::table)
        .values(the_game)
        .returning(games::all_columns)
        .get_result(conn)
}

pub fn select_games_for_group(conn: &PgConnection, the_group_id: i32) -> Vec<Game> {
    use crate::schema::games::dsl::*;

    games
        .filter(group_id.eq(the_group_id))
        .load(conn)
        .unwrap_or(Vec::new())
}

pub fn select_games_for_session(conn: &PgConnection, session: &Session) -> Vec<Game> {
    Game::belonging_to(session)
        .order_by(games::id)
        .load(conn)
        .unwrap_or(Vec::new())
}
