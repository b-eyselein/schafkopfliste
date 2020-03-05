-- Your SQL goes here

alter table player_in_groups
    add column if not exists saldo        integer not null default 0,
    add column if not exists game_count   integer not null default 0,
    add column if not exists put_count    integer not null default 0,
    add column if not exists played_games integer not null default 0,
    add column if not exists win_count    integer not null default 0;
