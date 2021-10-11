use bcrypt::{hash, verify, DEFAULT_COST};
use juniper::{graphql_object, FieldError, FieldResult, GraphQLInputObject};

use crate::graphql::context::GraphQLContext;
use crate::graphql::group_mutations::GroupMutations;
use crate::jwt_helpers::generate_token;
use crate::models::group::{insert_group, select_group_by_id};
use crate::models::group::{select_other_admin_usernames_for_group, Group};
use crate::models::user::{insert_user, user_by_username, User, UserWithToken};

pub struct Mutations;

pub fn on_no_login() -> FieldError {
    FieldError::from("User is not logged in!")
}

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

#[graphql_object(Context = GraphQLContext)]
impl Mutations {
    pub async fn register_user(register_user_input: RegisterUserInput, context: &GraphQLContext) -> FieldResult<String> {
        if !register_user_input.is_valid() {
            return Err(FieldError::from("Input is not valid!"));
        }

        let RegisterUserInput { username, password, .. } = register_user_input;

        let pw_hash = hash(password, DEFAULT_COST)?;

        context
            .connection
            .run(move |c| insert_user(c, &username, &pw_hash))
            .await
            .map_err(|_error| FieldError::from("Could not create user!"))
    }

    pub async fn login(credentials: Credentials, context: &GraphQLContext) -> FieldResult<UserWithToken> {
        let Credentials { username, password } = credentials;

        let on_login_error = || Err(FieldError::from("Invalid combination of username and password"));

        match context.connection.run(move |c| user_by_username(c, &username)).await? {
            None => on_login_error(),
            Some(user) => {
                let User { username, password_hash } = user;

                if verify(password, &password_hash)? {
                    Ok(generate_token(username)?)
                } else {
                    on_login_error()
                }
            }
        }
    }

    pub async fn create_group(name: String, context: &GraphQLContext) -> FieldResult<i32> {
        match context.authorization_header.username() {
            None => Err(on_no_login()),
            Some(username) => {
                let username = username.to_string();
                Ok(context.connection.run(move |c| insert_group(c, &username, &name)).await?)
            }
        }
    }

    pub async fn group(group_id: i32, context: &GraphQLContext) -> FieldResult<GroupMutations> {
        match context.connection.run(move |c| select_group_by_id(c, &group_id)).await? {
            None => Err(FieldError::from("No such group!")),
            Some(group) => {
                let Group { id, owner_username, .. } = group;

                let other_admin_username = context.connection.run(move |c| select_other_admin_usernames_for_group(c, &group_id)).await?;

                Ok(GroupMutations::new(id, owner_username, other_admin_username))
            }
        }
    }
}
