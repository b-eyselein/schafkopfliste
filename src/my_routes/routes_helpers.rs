use rocket::response::status::BadRequest;

pub fn on_error<E: std::fmt::Debug>(base_error_msg: &str, err: E) -> BadRequest<String> {
    eprintln!("{}: {:?}", base_error_msg, err);

    BadRequest(Some(base_error_msg.into()))
}
