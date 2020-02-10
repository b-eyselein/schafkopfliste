table! {
    groups (id) {
        id -> Int4,
        name -> Varchar,
    }
}

table! {
    player_in_groups (group_id, player_id) {
        group_id -> Int4,
        player_id -> Int4,
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
    use crate::models::game::*;

    rule_sets (id) {
        id -> Int4,
        name -> Varchar,
        count_laufende -> Count_laufende,
        geier_allowed -> Bool,
        hochzeit_allowed -> Bool,
        bettel_allowed -> Bool,
        ramsch_allowed -> Bool,
        farb_wenz_allowed -> Bool,
        farb_geier_allowed -> Bool,
    }
}

table! {
    sessions (uuid) {
        uuid -> Varchar,
        date -> Date,
        first_player_id -> Int4,
        second_player_id -> Int4,
        third_player_id -> Int4,
        fourth_player_id -> Int4,
        rule_set_id -> Int4,
    }
}

table! {
    users (username) {
        username -> Varchar,
        password_hash -> Varchar,
        player_id -> Nullable<Int4>,
    }
}

joinable!(player_in_groups -> groups (group_id));
joinable!(player_in_groups -> players (player_id));
joinable!(sessions -> rule_sets (rule_set_id));
joinable!(users -> players (player_id));

allow_tables_to_appear_in_same_query!(
    groups,
    player_in_groups,
    players,
    rule_sets,
    sessions,
    users,
);
