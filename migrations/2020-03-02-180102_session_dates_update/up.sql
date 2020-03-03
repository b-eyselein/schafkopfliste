-- Your SQL goes here

alter table sessions
    add column date_year         integer not null
        check (2000 <= date_year and date_year < 3000)
        default 2020,
    add column date_month        integer not null
        check (1 <= date_month and date_month < 12)
        default 2,
    add column date_day_of_month integer not null
        check (1 <= date_day_of_month and date_day_of_month < 31)
        default 29,
    drop column if exists date,
    add column time_hours        integer not null
        check (0 <= time_hours and time_hours < 23)
        default 12,
    add column time_minutes      integer not null
        check (0 <= time_minutes and time_minutes < 59)
        default 0,
    drop column if exists time;
