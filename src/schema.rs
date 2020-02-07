table! {
    groups (id) {
        id -> Integer,
        name -> Text,
    }
}

table! {
    player_in_groups (group_id, player_username) {
        group_id -> Integer,
        player_username -> Text,
    }
}

table! {
    player_with_passwords (username) {
        username -> Text,
        abbreviation -> Text,
        name -> Text,
        password_hash -> Text,
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
        first_player_username -> Text,
        second_player_username -> Text,
        third_player_username -> Text,
        fourth_player_username -> Text,
        rule_set_id -> Integer,
    }
}

joinable!(player_in_groups -> groups (group_id));
joinable!(player_in_groups -> player_with_passwords (player_username));
joinable!(sessions -> rule_sets (rule_set_id));

allow_tables_to_appear_in_same_query!(
    groups,
    player_in_groups,
    player_with_passwords,
    rule_sets,
    sessions,
);
