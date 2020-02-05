use diesel::{self, prelude::*};
use rocket_contrib::json::Json;

use crate::DbConn;
use crate::models::Player;

#[get("/")]
pub fn index(conn: DbConn) -> Result<Json<Vec<Player>>, String> {
    use crate::schema::players::dsl::*;

    players
        .load(&conn.0)
        .map_err(|err| -> String {
            println!("Error querying players: {:?}", err);
            "Error querying players from database".into()
        })
        .map(Json)
}

#[get("/players")]
pub fn players(conn: DbConn) -> Result<Json<Vec<Player>>, String> {
    use crate::schema::players::dsl::*;

    players
        .load(&conn.0)
        .map_err(|err| -> String {
            println!("Error querying players: {:?}", err);
            "Error querying players from database".into()
        })
        .map(Json)
}

#[put("/players", data = "<player>")]
pub fn create_player(conn: DbConn, player: Json<Player>) -> Result<Json<String>, String> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players)
        .values(&player.0)
        .execute(&conn.0)
        .map_err(|_err| -> String {
            format!("Error inserting player with abbreviation {} into db", &player.0.abbreviation)
        })?;

    Ok(Json(format!("Inserted player with abbreviation {} into db", &player.0.abbreviation)))
}
