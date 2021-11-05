table! {
    use diesel::sql_types::*;
    use crate::models::game_enums::{Bavarian_suit, Game_type, Kontra_type, Schneider_schwarz};

    games (group_id, session_id, id) {
        group_id -> Int4,
        session_id -> Int4,
        id -> Int4,
        acting_player_nickname -> Varchar,
        game_type -> Game_type,
        suit -> Nullable<Bavarian_suit>,
        tout -> Bool,
        is_doubled -> Bool,
        laufende_count -> Int4,
        schneider_schwarz -> Nullable<Schneider_schwarz>,
        players_having_put_nicknames -> Array<Text>,
        kontra -> Nullable<Kontra_type>,
        players_having_won_nicknames -> Array<Text>,
    }
}

table! {
    group_other_admins (group_id, user_username) {
        group_id -> Int4,
        user_username -> Varchar,
    }
}

table! {
    groups (id) {
        id -> Int4,
        owner_username -> Varchar,
        name -> Varchar,
    }
}

table! {
    players (group_id, nickname) {
        group_id -> Int4,
        nickname -> Varchar,
        name -> Nullable<Varchar>,
        balance -> Int4,
        game_count -> Int4,
        put_count -> Int4,
        played_games -> Int4,
        win_count -> Int4,
    }
}

table! {
    use diesel::sql_types::*;
    use crate::models::rule_set::Count_laufende;

    rule_sets (group_id, name) {
        group_id -> Int4,
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
    session_results (group_id, player_nickname, session_id) {
        group_id -> Int4,
        player_nickname -> Varchar,
        session_id -> Int4,
        result -> Int4,
    }
}

table! {
    sessions (group_id, id) {
        group_id -> Int4,
        id -> Int4,
        date -> Date,
        time -> Time,
        rule_set_name -> Varchar,
        has_ended -> Bool,
        first_player_nickname -> Varchar,
        second_player_nickname -> Varchar,
        third_player_nickname -> Varchar,
        fourth_player_nickname -> Varchar,
        other_creator_username -> Nullable<Varchar>,
    }
}

table! {
    users (username) {
        username -> Varchar,
        password_hash -> Varchar,
    }
}

joinable!(group_other_admins -> groups (group_id));
joinable!(group_other_admins -> users (user_username));
joinable!(groups -> users (owner_username));
joinable!(players -> groups (group_id));
joinable!(rule_sets -> groups (group_id));

allow_tables_to_appear_in_same_query!(games, group_other_admins, groups, players, rule_sets, session_results, sessions, users,);
