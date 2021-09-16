table! {
    use diesel::sql_types::*;
    use crate::models::game::game_enums::{Bavarian_suit, Game_type, Kontra_type, Schneider_schwarz};

    games (id, session_id, group_name) {
        id -> Int4,
        session_id -> Int4,
        group_name -> Varchar,
        acting_player_abbreviation -> Varchar,
        game_type -> Game_type,
        suit -> Nullable<Bavarian_suit>,
        tout -> Bool,
        is_doubled -> Bool,
        laufende_count -> Int4,
        schneider_schwarz -> Nullable<Schneider_schwarz>,
        players_having_put_abbreviations -> Array<Text>,
        kontra -> Nullable<Kontra_type>,
        players_having_won_abbreviations -> Array<Text>,
    }
}

table! {
    groups (name) {
        name -> Varchar,
        rule_set_name -> Varchar,
    }
}

table! {
    player_in_groups (group_name, player_abbreviation) {
        group_name -> Varchar,
        player_abbreviation -> Varchar,
        balance -> Int4,
        game_count -> Int4,
        put_count -> Int4,
        played_games -> Int4,
        win_count -> Int4,
        is_active -> Bool,
    }
}

table! {
    players (abbreviation) {
        abbreviation -> Varchar,
        name -> Varchar,
        picture_name -> Nullable<Varchar>,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::models::rule_set::Count_laufende;

    rule_sets (name) {
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
    session_results (player_abbreviation, session_id, group_name) {
        player_abbreviation -> Varchar,
        session_id -> Int4,
        group_name -> Varchar,
        result -> Int4,
    }
}

table! {
    sessions (id, group_name) {
        id -> Int4,
        group_name -> Varchar,
        date_year -> Int4,
        date_month -> Int4,
        date_day_of_month -> Int4,
        time_hours -> Int4,
        time_minutes -> Int4,
        has_ended -> Bool,
        first_player_abbreviation -> Varchar,
        second_player_abbreviation -> Varchar,
        third_player_abbreviation -> Varchar,
        fourth_player_abbreviation -> Varchar,
        creator_username -> Varchar,
    }
}

table! {
    users (username) {
        username -> Varchar,
        password_hash -> Varchar,
        is_admin -> Bool,
        player_abbreviation -> Nullable<Varchar>,
    }
}

joinable!(groups -> rule_sets (rule_set_name));
joinable!(player_in_groups -> groups (group_name));
joinable!(player_in_groups -> players (player_abbreviation));
joinable!(sessions -> groups (group_name));
joinable!(sessions -> users (creator_username));
joinable!(users -> players (player_abbreviation));

allow_tables_to_appear_in_same_query!(games, groups, player_in_groups, players, rule_sets, session_results, sessions, users,);
