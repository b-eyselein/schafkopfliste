use jsonwebtoken::TokenData;
use rocket::{
    request::{FromRequest, Outcome},
    Request,
};

use crate::jwt_helpers::{decode_token, Claims};

// Authorization header

pub struct AuthorizationHeader(Option<TokenData<Claims>>);

impl AuthorizationHeader {
    pub fn token(&self) -> Option<&TokenData<Claims>> {
        self.0.as_ref()
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for AuthorizationHeader {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> Outcome<Self, Self::Error> {
        let content = request
            .headers()
            .get_one("Authorization")
            .and_then(|t| decode_token(t).ok());

        Outcome::Success(AuthorizationHeader(content))
    }
}
