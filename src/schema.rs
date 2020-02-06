table! {
    allowed_game_type_in_sessions (session_uuid, game_type_id) {
        session_uuid -> Text,
        game_type_id -> Integer,
    }
}

table! {
    game_types (id) {
        id -> Integer,
        name -> Text,
        is_default_game_type -> Bool,
    }
}

table! {
    players (username) {
        username -> Text,
        abbreviation -> Text,
        name -> Text,
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
    }
}

allow_tables_to_appear_in_same_query!(allowed_game_type_in_sessions, game_types, players, sessions,);
