table! {
    groups (id) {
        id -> Integer,
        name -> Text,
    }
}

table! {
    player_in_groups (group_id, player_id) {
        group_id -> Integer,
        player_id -> Integer,
    }
}

table! {
    players (id) {
        id -> Integer,
        abbreviation -> Text,
        name -> Text,
    }
}

table! {
    rule_sets (id) {
        id -> Integer,
        name -> Text,
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
        uuid -> Text,
        date -> Date,
        first_player_id -> Integer,
        second_player_id -> Integer,
        third_player_id -> Integer,
        fourth_player_id -> Integer,
        rule_set_id -> Integer,
    }
}

table! {
    users (username) {
        username -> Text,
        password_hash -> Text,
        player_id -> Nullable<Integer>,
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
