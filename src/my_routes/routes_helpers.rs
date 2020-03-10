use rocket::response::status::BadRequest;
use rocket_contrib::json::Json;

pub type MyJsonResponse<T> = Result<Json<T>, BadRequest<&'static str>>;

pub fn on_error<E: std::fmt::Debug>(base_error_msg: &str, err: E) -> BadRequest<&str> {
    eprintln!("{}: {:?}", base_error_msg, err);

    BadRequest(Some(base_error_msg))
}
