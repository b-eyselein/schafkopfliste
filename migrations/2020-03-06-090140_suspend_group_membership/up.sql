-- Your SQL goes here

alter table player_in_groups
    add column if not exists is_active bool not null default true;
