use jsonwebtoken::TokenData;
use rocket::{
    request::{FromRequest, Outcome},
    Request,
};

use crate::jwt_helpers::{decode_token, Claims};

// Authorization header

pub struct AuthorizationHeader(Option<TokenData<Claims>>);

impl AuthorizationHeader {
    pub fn username(&self) -> Option<&str> {
        return self.0.as_ref().map(|token| token.claims.username());
    }
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthorizationHeader {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let content = request.headers().get_one("Authorization").and_then(|t| decode_token(t).ok());

        Outcome::Success(AuthorizationHeader(content))
    }
}
