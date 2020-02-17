use diesel::{self, prelude::*, PgConnection};
use either::{Either, Left, Right};
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

#[derive(Debug, Serialize, Deserialize)]
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

    players_having_put: Either<i32, Vec<i32>>,
    players_with_contra: Either<i32, Vec<i32>>,
    players_having_won_ids: Vec<i32>,
}

#[derive(Debug, Identifiable, Queryable, Insertable, Associations)]
#[belongs_to(Session)]
#[table_name = "games"]
struct DbGame {
    id: i32,
    session_id: i32,
    group_id: i32,

    acting_player_id: i32,
    game_type: GameType,
    suit: Option<BavarianSuit>,

    is_doubled: bool,
    laufende_count: i32,
    schneider_schwarz: Option<SchneiderSchwarz>,

    players_having_put_count: i32,
    players_having_put_ids: Option<Vec<i32>>,
    players_with_contra_count: i32,
    players_with_contra_ids: Option<Vec<i32>>,
    players_having_won_ids: Vec<i32>,
}

impl DbGame {
    fn from_game(group_id: i32, session_id: i32, game: Game) -> DbGame {
        let (players_having_put_count, players_having_put_ids) = match game.players_having_put {
            Left(count) => (count, None),
            Right(players_having_put_ids) => (
                players_having_put_ids.len() as i32,
                Some(players_having_put_ids),
            ),
        };
        let (players_with_contra_count, players_with_contra_ids) = match game.players_with_contra {
            Left(count) => (count, None),
            Right(players_with_contra_ids) => (
                players_with_contra_ids.len() as i32,
                Some(players_with_contra_ids),
            ),
        };

        DbGame {
            id: game.id,
            session_id,
            group_id,
            acting_player_id: game.acting_player_id,
            game_type: game.game_type,
            suit: game.suit,
            is_doubled: game.is_doubled,
            laufende_count: game.laufende_count,
            schneider_schwarz: game.schneider_schwarz,
            players_having_put_count,
            players_having_put_ids,
            players_with_contra_count,
            players_with_contra_ids,
            players_having_won_ids: game.players_having_won_ids,
        }
    }

    //noinspection RsSelfConvention
    fn to_game(db_game: DbGame) -> Game {
        Game {
            id: db_game.id,
            group_id: db_game.group_id,
            session_id: db_game.session_id,
            acting_player_id: db_game.acting_player_id,
            game_type: db_game.game_type,
            suit: db_game.suit,
            is_doubled: db_game.is_doubled,
            laufende_count: db_game.laufende_count,
            schneider_schwarz: db_game.schneider_schwarz,
            players_having_put: match db_game.players_having_put_ids {
                None => Left(db_game.players_having_put_count),
                Some(players_having_put_ids) => Right(players_having_put_ids),
            },
            players_with_contra: match db_game.players_with_contra_ids {
                None => Left(db_game.players_with_contra_count),
                Some(players_with_contra_ids) => Right(players_with_contra_ids),
            },
            players_having_won_ids: db_game.players_having_won_ids,
        }
    }
}

pub fn insert_game(
    conn: &PgConnection,
    group_id: i32,
    session_id: i32,
    game: Game,
) -> Result<Game, String> {
    /*
    let game_to_insert: Game = Game {
        group_id,
        session_id,
        ..game
    };
    */

    let db_game: DbGame = DbGame::from_game(group_id, session_id, game);

    diesel::insert_into(games::table)
        .values(db_game)
        .returning(games::all_columns)
        .get_result(conn)
        .map(|db_game| DbGame::to_game(db_game))
        .map_err(|err| {
            println!("Error while inserting game into db: {}", err);
            "Error while inserting game into database".into()
        })
}

pub fn select_games_for_session(conn: &PgConnection, session: &Session) -> Vec<Game> {
    DbGame::belonging_to(session)
        .load::<DbGame>(conn)
        .unwrap_or(Vec::new())
        .into_iter()
        .map(DbGame::to_game)
        .collect()
}
