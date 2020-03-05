table! {
    use diesel::sql_types::*;
    use crate::models::game_enums::{Bavarian_suit, Game_type, Kontra_type, Schneider_schwarz};

    games (id, session_id, group_id) {
        id -> Int4,
        session_id -> Int4,
        group_id -> Int4,
        acting_player_id -> Int4,
        game_type -> Game_type,
        suit -> Nullable<Bavarian_suit>,
        tout -> Bool,
        is_doubled -> Bool,
        laufende_count -> Int4,
        schneider_schwarz -> Nullable<Schneider_schwarz>,
        players_having_put_ids -> Array<Int4>,
        kontra -> Nullable<Kontra_type>,
        players_having_won_ids -> Array<Int4>,
    }
}

table! {
    groups (id) {
        id -> Int4,
        name -> Varchar,
        default_rule_set_id -> Nullable<Int4>,
    }
}

table! {
    player_in_groups (group_id, player_id) {
        group_id -> Int4,
        player_id -> Int4,
        saldo_for_group -> Int4,
    }
}

table! {
    players (id) {
        id -> Int4,
        abbreviation -> Varchar,
        name -> Varchar,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::models::rule_set::Count_laufende;

    rule_sets (id) {
        id -> Int4,
        name -> Varchar,
        base_price -> Int4,
        solo_price -> Int4,
        count_laufende -> Count_laufende,
        min_laufende_incl -> Int4,
        max_laufende_incl -> Int4,
        laufende_price -> Int4,
        geier_allowed -> Bool,
        hochzeit_allowed -> Bool,
        bettel_allowed -> Bool,
        ramsch_allowed -> Bool,
        farb_wenz_allowed -> Bool,
        farb_geier_allowed -> Bool,
    }
}

table! {
    sessions (id, group_id) {
        id -> Int4,
        group_id -> Int4,
        has_ended -> Bool,
        first_player_id -> Int4,
        second_player_id -> Int4,
        third_player_id -> Int4,
        fourth_player_id -> Int4,
        rule_set_id -> Int4,
        creator_username -> Varchar,
        date_year -> Int4,
        date_month -> Int4,
        date_day_of_month -> Int4,
        time_hours -> Int4,
        time_minutes -> Int4,
    }
}

table! {
    users (username) {
        username -> Varchar,
        password_hash -> Varchar,
        player_id -> Nullable<Int4>,
    }
}

joinable!(games -> players (acting_player_id));
joinable!(groups -> rule_sets (default_rule_set_id));
joinable!(player_in_groups -> groups (group_id));
joinable!(player_in_groups -> players (player_id));
joinable!(sessions -> groups (group_id));
joinable!(sessions -> rule_sets (rule_set_id));
joinable!(sessions -> users (creator_username));
joinable!(users -> players (player_id));

allow_tables_to_appear_in_same_query!(
    games,
    groups,
    player_in_groups,
    players,
    rule_sets,
    sessions,
    users,
);
