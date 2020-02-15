use diesel::{self, prelude::*, PgConnection};
use serde::{Deserialize, Serialize};

use crate::models::session::Session;
use crate::schema::games;

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum)]
#[DieselType = "Bavarian_suit"]
pub enum BavarianSuit {
    Acorns,
    Leaves,
    Hearts,
    Bells,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum)]
#[DieselType = "Game_type"]
pub enum GameType {
    Ruf,
    Wenz,
    Farbsolo,
    Geier,
    Hochzeit,
    Bettel,
    Ramsch,
    Farbwenz,
    Farbgeier,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum)]
#[DieselType = "Schneider_schwarz"]
pub enum SchneiderSchwarz {
    Schneider,
    Schwarz,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable, Insertable, Associations)]
#[belongs_to(Session)]
#[serde(rename_all = "camelCase")]
pub struct Game {
    id: i32,
    session_id: i32,
    group_id: i32,

    acting_player_id: i32,
    game_type: GameType,
    suit: Option<BavarianSuit>,

    is_doubled: bool,
    laufende_count: i32,
    schneider_schwarz: Option<SchneiderSchwarz>,

    players_having_put_ids: Vec<i32>,
    players_with_contra_ids: Vec<i32>,
    players_having_won_ids: Vec<i32>,
}

pub fn insert_game(
    conn: &PgConnection,
    group_id: i32,
    session_id: i32,
    game: Game,
) -> Result<Game, String> {
    let game_to_insert: Game = Game {
        group_id,
        session_id,
        ..game
    };

    diesel::insert_into(games::table)
        .values(game_to_insert)
        .returning(games::all_columns)
        .get_result(conn)
        .map_err(|err| {
            println!("Error while inserting game into db: {}", err);
            "Error while inserting game into database".into()
        })
}

pub fn select_games_for_session(conn: &PgConnection, session: &Session) -> Vec<Game> {
    Game::belonging_to(session)
        .load::<Game>(conn)
        .unwrap_or(Vec::new())
}
