use juniper::{graphql_object, FieldResult};

use crate::graphql::context::GraphQLContext;
use crate::graphql::on_graphql_error;
use crate::models::group::{select_group_by_id, select_groups, select_groups_for_username, Group};

pub struct QueryRoot;

#[graphql_object(Context = GraphQLContext)]
impl QueryRoot {
    pub async fn groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        context
            .connection
            .run(move |c| select_groups(c))
            .await
            .map_err(|error| on_graphql_error(error, "Could not find groups!"))
    }

    pub async fn group(group_id: i32, context: &GraphQLContext) -> FieldResult<Option<Group>> {
        context
            .connection
            .run(move |c| select_group_by_id(c, &group_id))
            .await
            .map_err(|error| on_graphql_error(error, "Could not find group!"))
    }

    pub async fn my_groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        let username = context.check_user_login()?.username.clone();

        context
            .connection
            .run(move |c| select_groups_for_username(c, &username))
            .await
            .map_err(|error| on_graphql_error(error, "Could not find groups!"))
    }
}
