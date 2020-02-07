use diesel::{self, prelude::*};
use rocket_contrib::json::Json;
use uuid::Uuid;

use crate::dao::{authenticate_user, get_groups, get_players};
use crate::models::player::{Credentials, Group, Player, PlayerWithPassword};
use crate::models::session::{CreatableSession, Session};
use crate::DbConn;

#[get("/")]
pub fn index(conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(conn))
}

#[put("/authentication", format = "application/json", data = "<credentials>")]
pub fn authenticate(conn: DbConn, credentials: Json<Credentials>) -> String {
    let authenticated = authenticate_user(conn, credentials.0);

    if authenticated {
        "Authenticated".into()
    } else {
        "Not authenticated!".into()
    }
}

#[get("/groups")]
pub fn groups(conn: DbConn) -> Json<Vec<Group>> {
    Json(get_groups(conn))
}

#[get("/players")]
pub fn players(conn: DbConn) -> Json<Vec<Player>> {
    Json(get_players(conn))
}

#[put("/players", format = "application/json", data = "<player>")]
pub fn create_player(
    conn: DbConn,
    player: Json<PlayerWithPassword>,
) -> Result<Json<Player>, String> {
    use crate::schema::player_with_passwords::dsl::*;

    diesel::insert_into(player_with_passwords)
        .values(&player.0)
        .execute(&conn.0)
        .map_err(|_| -> String {
            format!(
                "Error inserting player with abbreviation {} into db",
                &player.0.abbreviation
            )
        })?;

    Ok(Json(Player::from_player_with_password(player.0)))
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
