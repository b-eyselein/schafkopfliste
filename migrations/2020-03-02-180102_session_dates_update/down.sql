-- This file should undo anything in `up.sql`

alter table sessions
    drop column date_year,
    drop column date_month,
    drop column date_day_of_month,
    add column date date not null default '2020-02-29',
    drop column time_hours,
    drop column time_minutes,
    add column time time not null default '12:00';
