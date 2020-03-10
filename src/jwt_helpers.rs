use jsonwebtoken::{decode, encode, errors::Error as JwtError, Header, Validation};
use regex::Regex;
use rocket::http::Status;
use rocket::request::FromRequest;
use rocket::request::Outcome as RequestOutcome;
use rocket::{Outcome, Request};

use lazy_static::lazy_static;

use crate::models::user::{Claims, SerializableUser, UserWithToken};

const SECRET: &str = "my_secret_key";
const HEADER_NAME: &str = "Authorization";

lazy_static! {
    static ref BEARER_REGEX: Regex = Regex::new(r"Bearer (.*)").unwrap();
    static ref VALIDATION: Validation = Validation {
        validate_exp: false,
        ..Default::default()
    };
}

pub struct MyJwt {
    pub header: Header,
    pub claims: Claims,
}

pub fn generate_token(user: SerializableUser) -> Result<UserWithToken, JwtError> {
    let token = encode(
        &Header::default(),
        &Claims::new(user.clone()),
        SECRET.as_ref(),
    )?;

    Ok(UserWithToken::new(user, token))
}

#[derive(Debug)]
pub enum MyJwtTokenError {
    BadCount,
    Missing,
    Invalid,
}

fn decode_token(auth_header: &str) -> RequestOutcome<MyJwt, MyJwtTokenError> {
    match BEARER_REGEX
        .captures(auth_header)
        .and_then(|token| token.get(1))
    {
        None => Outcome::Failure((Status::Unauthorized, MyJwtTokenError::Invalid)),
        Some(token_match) => {
            match decode::<Claims>(&token_match.as_str(), SECRET.as_ref(), &VALIDATION) {
                Err(_) => Outcome::Failure((Status::Unauthorized, MyJwtTokenError::Invalid)),
                Ok(claim) => Outcome::Success(MyJwt {
                    header: claim.header,
                    claims: claim.claims,
                }),
            }
        }
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for MyJwt {
    type Error = MyJwtTokenError;

    fn from_request(request: &'a Request<'r>) -> RequestOutcome<Self, MyJwtTokenError> {
        let auth_headers = request.headers().get(HEADER_NAME).collect::<Vec<&str>>();

        match auth_headers.as_slice() {
            [] => Outcome::Failure((Status::Unauthorized, MyJwtTokenError::Missing)),
            [auth_header] => decode_token(auth_header),
            _ => Outcome::Failure((Status::Unauthorized, MyJwtTokenError::BadCount)),
        }
    }
}
