use serde::{Deserialize, Serialize};
use serde_tsi::prelude::*;

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum, HasTypescriptType)]
#[DieselType = "Bavarian_suit"]
pub enum BavarianSuit {
    Acorns,
    Leaves,
    Hearts,
    Bells,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum, HasTypescriptType)]
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

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum, HasTypescriptType)]
#[DieselType = "Schneider_schwarz"]
pub enum SchneiderSchwarz {
    Schneider,
    Schwarz,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, DbEnum, HasTypescriptType)]
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
