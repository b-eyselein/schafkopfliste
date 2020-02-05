table! {
    players (abbreviation) {
        abbreviation -> Text,
        name -> Text,
    }
}

table! {
    sessions (uuid) {
        uuid -> Text,
    }
}

allow_tables_to_appear_in_same_query!(
    players,
    sessions,
);
