use crate::schema::players;

#[derive(Serialize, Deserialize, Queryable, Insertable)]
pub struct Player {
    pub abbreviation: String,
    pub name: String,
}
