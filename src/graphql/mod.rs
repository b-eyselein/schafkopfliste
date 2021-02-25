use juniper::{EmptySubscription, RootNode};

pub use context::GraphQLContext;
pub use mutation::Mutations;
pub use query::{graphql_on_db_error, QueryRoot};

mod context;
mod mutation;
mod query;

pub type Schema = RootNode<'static, QueryRoot, Mutations, EmptySubscription<GraphQLContext>>;
