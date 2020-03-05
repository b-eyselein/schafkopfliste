use diesel::{self, pg::PgConnection, prelude::*, result::Error as DbError};

use super::game::Game;
use super::session::Session;
use crate::schema::games;

pub fn insert_game(conn: &PgConnection, game: &Game) -> Result<Game, DbError> {
    diesel::insert_into(games::table)
        .values(game)
        .returning(games::all_columns)
        .get_result(conn)
}

pub fn select_games_for_session(conn: &PgConnection, session: &Session) -> Vec<Game> {
    Game::belonging_to(session)
        .order_by(games::id)
        .load::<Game>(conn)
        .unwrap_or(Vec::new())
}
