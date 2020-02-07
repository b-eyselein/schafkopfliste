use serde::{Deserialize, Serialize};

use crate::schema::{groups, player_in_groups, player_with_passwords};

#[derive(Debug, Deserialize)]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable)]
pub struct Group {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Player {
    pub username: String,
    pub abbreviation: String,
    pub name: String,
}

impl Player {
    pub fn from_player_with_password(pwp: PlayerWithPassword) -> Player {
        Player {
            username: pwp.username,
            abbreviation: pwp.abbreviation,
            name: pwp.name,
        }
    }
}

#[derive(Debug, Deserialize, Queryable, Insertable)]
pub struct PlayerWithPassword {
    pub username: String,
    pub abbreviation: String,
    pub name: String,
    pub password_hash: String,
}

#[derive(Debug, Queryable, Insertable)]
pub struct PlayerInGroup {
    pub group_id: i32,
    pub player_username: String,
}
