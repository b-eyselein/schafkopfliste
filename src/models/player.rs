use juniper::graphql_object;
use serde::{Deserialize, Serialize};

use crate::schema::players;
use crate::GraphQLContext;

#[derive(Debug, Deserialize, Insertable, juniper::GraphQLInputObject)]
#[serde(rename_all = "camelCase")]
#[table_name = "players"]
pub struct NewPlayer {
    pub abbreviation: String,
    pub name: String,
    pub picture_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Identifiable, Queryable)]
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

#[graphql_object(Context = GraphQLContext)]
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
