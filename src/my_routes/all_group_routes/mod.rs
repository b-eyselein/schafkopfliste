use rocket::Route;

mod group_routes;

mod session_routes;

mod game_routes;

pub fn exported_routes() -> Vec<Route> {
    [
        game_routes::exported_routes(),
        group_routes::exported_routes(),
        session_routes::exported_routes(),
    ]
    .concat()
}
