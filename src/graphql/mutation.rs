use bcrypt::{hash, verify, DEFAULT_COST};
use juniper::{graphql_object, FieldError, FieldResult, GraphQLInputObject};

use crate::graphql::context::GraphQLContext;
use crate::graphql::group_mutations::GroupMutations;
use crate::graphql::{on_graphql_error, on_insufficient_rights};
use crate::jwt_helpers::generate_token;
use crate::models::group::{insert_group, select_group_by_id};
use crate::models::group::{select_other_admin_usernames_for_group, Group};
use crate::models::user::{insert_user, select_user_by_username, User, UserWithToken};

pub struct Mutations;

#[derive(Debug, GraphQLInputObject)]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Debug, GraphQLInputObject)]
pub struct RegisterUserInput {
    pub username: String,
    pub password: String,
    pub password_repeat: String,
}

impl RegisterUserInput {
    pub fn is_valid(&self) -> bool {
        !self.username.is_empty() && !self.password.is_empty() && !self.password_repeat.is_empty() && self.password == self.password_repeat
    }
}

const REGISTRATION_ERROR_MSG: &str = "Could not process registration!";

const LOGIN_ERROR_MSG: &str = "Invalid combination of username and password";

#[graphql_object(Context = GraphQLContext)]
impl Mutations {
    pub async fn register_user(register_user_input: RegisterUserInput, context: &GraphQLContext) -> FieldResult<String> {
        if !register_user_input.is_valid() {
            return Err(FieldError::from("Input is not valid!"));
        }

        let RegisterUserInput { username, password, .. } = register_user_input;

        let pw_hash = hash(password, DEFAULT_COST).map_err(|error| on_graphql_error(error, REGISTRATION_ERROR_MSG))?;

        context
            .connection
            .run(move |c| insert_user(c, &username, &pw_hash))
            .await
            .map_err(|error| on_graphql_error(error, REGISTRATION_ERROR_MSG))
    }

    pub async fn login(credentials: Credentials, context: &GraphQLContext) -> FieldResult<UserWithToken> {
        let Credentials { username, password } = credentials;

        let on_login_error = || FieldError::from(LOGIN_ERROR_MSG);

        let User { username, password_hash } = context
            .connection
            .run(move |c| select_user_by_username(c, &username))
            .await
            .map_err(|error| on_graphql_error(error, LOGIN_ERROR_MSG))?
            .ok_or_else(on_login_error)?;

        if verify(password, &password_hash).map_err(|error| on_graphql_error(error, LOGIN_ERROR_MSG))? {
            generate_token(username).map_err(|error| on_graphql_error(error, LOGIN_ERROR_MSG))
        } else {
            Err(on_login_error())
        }
    }

    pub async fn create_group(name: String, context: &GraphQLContext) -> FieldResult<i32> {
        let username = context.check_user_login()?.username.clone();

        context
            .connection
            .run(move |c| insert_group(c, &username, &name))
            .await
            .map_err(|error| on_graphql_error(error, "Could not create group!"))
    }

    pub async fn group(group_id: i32, context: &GraphQLContext) -> FieldResult<GroupMutations> {
        let username = context.check_user_login()?.username.clone();

        let Group { id, owner_username, .. } = context
            .connection
            .run(move |c| select_group_by_id(c, &group_id))
            .await
            .map_err(|error| on_graphql_error(error, "Could not find group!"))?
            .ok_or_else(|| FieldError::from("No such group!"))?;

        let other_admin_usernames = context
            .connection
            .run(move |c| select_other_admin_usernames_for_group(c, &group_id))
            .await
            .map_err(|error| on_graphql_error(error, "Could not find other group admins!"))?;

        if owner_username == username {
            Ok(GroupMutations::new(id, None))
        } else if other_admin_usernames.contains(&username) {
            Ok(GroupMutations::new(id, Some(username)))
        } else {
            Err(on_insufficient_rights())
        }
    }
}
