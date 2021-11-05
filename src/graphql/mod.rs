use juniper::{EmptySubscription, FieldError, RootNode};

pub use context::GraphQLContext;
pub use mutation::Mutations;
pub use query::QueryRoot;

mod context;
mod mutation;
mod query;

mod group_mutations;
mod session_mutations;

pub fn on_graphql_error<E: std::fmt::Display>(error: E, msg: &str) -> FieldError {
    eprintln!("{}", error);
    FieldError::from(msg)
}

pub fn on_insufficient_rights() -> FieldError {
    FieldError::from("Insufficient rights")
}

pub type Schema = RootNode<'static, QueryRoot, Mutations, EmptySubscription<GraphQLContext>>;
