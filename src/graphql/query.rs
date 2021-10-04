use diesel::result::Error as DbError;
use juniper::{graphql_object, FieldError, FieldResult};

use crate::graphql::context::GraphQLContext;
use crate::models::group::{select_group_by_id, select_groups, select_groups_for_username, Group};

pub struct QueryRoot;

pub fn graphql_on_db_error(db_error: DbError) -> FieldError {
    eprintln!("Error while querying db: {}", db_error);
    FieldError::from("Error while querying db")
}

#[graphql_object(Context = GraphQLContext)]
impl QueryRoot {
    pub async fn groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        Ok(context.connection.run(move |c| select_groups(c)).await?)
    }

    pub async fn maybe_group(group_id: i32, context: &GraphQLContext) -> FieldResult<Option<Group>> {
        Ok(context.connection.run(move |c| select_group_by_id(c, &group_id)).await?)
    }

    pub async fn group(group_id: i32, context: &GraphQLContext) -> FieldResult<Group> {
        match context.connection.run(move |c| select_group_by_id(c, &group_id)).await? {
            None => Err(FieldError::from("No such group!")),
            Some(group) => Ok(group),
        }
    }

    pub async fn my_groups(context: &GraphQLContext) -> FieldResult<Vec<Group>> {
        match context.authorization_header.username() {
            None => Err(FieldError::from("No login provided!")),
            Some(username) => {
                let username = username.to_string();
                Ok(context.connection.run(move |c| select_groups_for_username(c, &username)).await?)
            }
        }
    }
}
