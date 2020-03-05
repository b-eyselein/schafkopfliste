-- This file should undo anything in `up.sql`

alter table player_in_groups
    drop column if exists saldo,
    drop column if exists game_count,
    drop column if exists put_count,
    drop column if exists played_games,
    drop column if exists win_count;
