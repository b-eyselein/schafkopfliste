use jsonwebtoken::{
    decode, encode, errors::Error as JwtError, DecodingKey, EncodingKey, Header, TokenData,
    Validation,
};
use serde::{Deserialize, Serialize};

use crate::models::user::UserWithToken;

const SECRET: &str = "klasidzf0a89s7dtzfv087sdtfv08d8s7v";

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    username: String,
}

impl Claims {
    pub fn new(username: String) -> Claims {
        Claims { username }
    }

    pub fn username(&self) -> &str {
        &self.username
    }
}

pub fn encode_token(claims: &Claims) -> jsonwebtoken::errors::Result<String> {
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(SECRET.as_ref()),
    )
}

pub fn decode_token(token: &str) -> jsonwebtoken::errors::Result<TokenData<Claims>> {
    let validation = Validation {
        validate_exp: false,
        ..Default::default()
    };

    decode::<Claims>(
        &token,
        &DecodingKey::from_secret(SECRET.as_ref()),
        &validation,
    )
}

pub fn generate_token(
    username: String,
    is_admin: bool,
    player_abbreviation: Option<String>,
) -> Result<UserWithToken, JwtError> {
    let token = encode_token(&Claims::new(username.clone()))?;

    Ok(UserWithToken::new(
        username,
        is_admin,
        player_abbreviation,
        token,
    ))
}
