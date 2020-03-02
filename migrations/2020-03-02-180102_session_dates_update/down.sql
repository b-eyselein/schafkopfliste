-- This file should undo anything in `up.sql`

alter table sessions
    drop column date_year,
    drop column date_month,
    drop column date_day_of_month,
    add column date date not null,
    drop column time_hours,
    drop column time_minutes,
    add column time time not null;
