use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

use crate::schema::players;

#[derive(Debug, Deserialize, Insertable, HasTypescriptType, juniper::GraphQLInputObject)]
#[serde(rename_all = "camelCase")]
#[table_name = "players"]
pub struct NewPlayer {
    pub abbreviation: String,
    pub name: String,
    pub picture_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable, HasTypescriptType)]
#[serde(rename_all = "camelCase")]
pub struct Player {
    pub id: i32,
    pub abbreviation: String,
    pub name: String,
    pub picture_name: Option<String>,
}

impl Player {
    pub fn new(id: i32, abbreviation: String, name: String) -> Player {
        Player {
            id,
            abbreviation,
            name,
            picture_name: None,
        }
    }
}

#[juniper::object]
impl Player {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn abbreviation(&self) -> &String {
        &self.abbreviation
    }

    pub fn name(&self) -> &String {
        &self.name
    }

    pub fn picture_name(&self) -> &Option<String> {
        &self.picture_name
    }
}

pub fn exported_ts_types() -> Vec<TsType> {
    vec![NewPlayer::ts_type(), Player::ts_type()]
}
