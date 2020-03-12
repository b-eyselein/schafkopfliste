use diesel::{prelude::*, PgConnection, QueryResult};

use crate::models::player::{CreatablePlayer, Player};

pub fn select_players(conn: &PgConnection) -> QueryResult<Vec<Player>> {
    use crate::schema::players::dsl::*;

    players.load(conn)
}

pub fn select_player_by_id(conn: &PgConnection, the_id: &i32) -> QueryResult<Player> {
    use crate::schema::players::dsl::*;

    players.filter(id.eq(the_id)).first(conn)
}

pub fn insert_player(
    conn: &PgConnection,
    creatable_player: CreatablePlayer,
) -> QueryResult<Player> {
    use crate::schema::players::dsl::*;

    diesel::insert_into(players)
        .values(&creatable_player)
        .returning(id)
        .get_result(conn)
        .map(|new_player_id| {
            Player::new(
                new_player_id,
                creatable_player.abbreviation,
                creatable_player.name,
            )
        })
}
