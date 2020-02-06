use diesel::{self, prelude::*};
use rocket_contrib::json::Json;
use uuid::Uuid;

use crate::models::{CreatableSession, GameType, Player, Session};
use crate::DbConn;

#[get("/")]
pub fn index(conn: DbConn) -> Result<Json<Vec<Player>>, String> {
    use crate::schema::players::dsl::*;

    players
        .load(&conn.0)
        .map_err(|_| -> String { "Error querying players from database".into() })
        .map(Json)
}

#[get("/gameTypes")]
pub fn game_types(conn: DbConn) -> Result<Json<Vec<GameType>>, String> {
    use crate::schema::game_types::dsl::*;

    game_types
        .load(&conn.0)
        .map_err(|_| -> String { "Error querying gameTypes from database".into() })
        .map(Json)
}

#[get("/players")]
pub fn players(conn: DbConn) -> Result<Json<Vec<Player>>, String> {
    use crate::schema::players::dsl::*;

    players
        .load(&conn.0)
        .map_err(|_| -> String { "Error querying players from database".into() })
        .map(Json)
}

#[put("/players", format = "application/json", data = "<player>")]
pub fn create_player(conn: DbConn, player: Json<Player>) -> Result<Json<Player>, String> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players)
        .values(&player.0)
        .execute(&conn.0)
        .map_err(|_| -> String {
            format!(
                "Error inserting player with abbreviation {} into db",
                &player.0.abbreviation
            )
        })?;

    Ok(Json(player.0))
}

#[put("/sessions", format = "application/json", data = "<creatable_session>")]
pub fn create_session(
    _conn: DbConn,
    creatable_session: Json<CreatableSession>,
) -> Result<Json<i32>, String> {
    println!("{:?}", creatable_session);

    let uuid = Uuid::new_v4().to_string();

    let session = Session::from_creatable_session(uuid, creatable_session.0);

    println!("{:?}", session);

    Err("Not yet implemented".into())
}
