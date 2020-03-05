use diesel::result::Error as DbError;
use rocket_contrib::json::{Json, JsonError};

pub fn on_db_error(base_error_msg: &str, err: DbError) -> Json<String> {
    println!("{}: {:?}", base_error_msg, err);
    Json(base_error_msg.into())
}

pub fn on_json_error(base_error_msg: &str, err: JsonError) -> Json<String> {
    println!("{}: {:?}", base_error_msg, err);
    Json(base_error_msg.into())
}
