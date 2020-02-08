use serde::{Deserialize, Serialize};

use crate::schema::{groups, player_in_groups, players};

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable)]
pub struct Group {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, Deserialize, Insertable)]
#[table_name = "players"]
pub struct CreatablePlayer {
    pub abbreviation: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Queryable)]
pub struct Player {
    pub id: i32,
    pub abbreviation: String,
    pub name: String,
}

impl Player {
    pub fn from_creatable_player(id: i32, cp: CreatablePlayer) -> Player {
        Player { id, abbreviation: cp.abbreviation, name: cp.name }
    }
}

#[derive(Debug, Queryable, Insertable)]
pub struct PlayerInGroup {
    pub group_id: i32,
    pub player_id: i32,
}
