use diesel::{prelude::*, PgConnection, QueryResult};

use crate::models::accumulated_result::AccumulatedResult;
use crate::models::player_in_group::PlayerInGroup;

pub fn update_player_group_result(conn: &PgConnection, the_player_nickname: &str, res: &AccumulatedResult) -> QueryResult<PlayerInGroup> {
    use crate::schema::player_in_groups::dsl::*;

    diesel::update(player_in_groups)
        .filter(player_nickname.eq(the_player_nickname))
        .set((
            balance.eq(balance + res.balance),
            game_count.eq(game_count + res.game_count),
            put_count.eq(put_count + res.put_count),
            played_games.eq(played_games + res.played_games),
            win_count.eq(win_count + res.win_count),
        ))
        .get_result(conn)
}
