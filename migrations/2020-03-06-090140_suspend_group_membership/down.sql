-- This file should undo anything in `up.sql`

alter table player_in_groups
    drop column if exists is_active;
