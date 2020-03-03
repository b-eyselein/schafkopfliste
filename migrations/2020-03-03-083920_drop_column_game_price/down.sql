-- This file should undo anything in `up.sql`

alter table games
    add column price integer not null default 0;
