use crate::additional_headers::AuthorizationHeader;
use crate::DbConn;

pub struct GraphQLContext {
    pub connection: DbConn,
    pub authorization_header: AuthorizationHeader
}

impl GraphQLContext {
    pub fn new(conn: DbConn, authorization_header: AuthorizationHeader) -> Self {
        Self {
            connection: conn,
            authorization_header
        }
    }
}

impl juniper::Context for GraphQLContext {}
