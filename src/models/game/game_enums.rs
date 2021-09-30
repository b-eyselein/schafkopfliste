use juniper::GraphQLEnum;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, DbEnum, GraphQLEnum)]
#[DieselType = "Bavarian_suit"]
pub enum BavarianSuit {
    Acorns,
    Leaves,
    Hearts,
    Bells,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, DbEnum, GraphQLEnum)]
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

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, DbEnum, GraphQLEnum)]
#[DieselType = "Schneider_schwarz"]
pub enum SchneiderSchwarz {
    Schneider,
    Schwarz,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, DbEnum, GraphQLEnum)]
#[DieselType = "Kontra_type"]
pub enum KontraType {
    Kontra,
    Re,
    Supra,
    Resupra,
}

impl KontraType {
    pub fn get_count(&self) -> u32 {
        match self {
            KontraType::Kontra => 1,
            KontraType::Re => 2,
            KontraType::Supra => 3,
            KontraType::Resupra => 4,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, DbEnum, GraphQLEnum)]
#[DieselType = "Table_position"]
pub enum TablePosition {
    Dealer,
    PreHand,
    MiddleHand,
    RearHand,
}
