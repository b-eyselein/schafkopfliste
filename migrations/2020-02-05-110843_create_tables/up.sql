-- Your SQL goes here

create table players (
    abbreviation varchar(5)   not null,
    name         varchar(100) not null,

    primary key (abbreviation)
);

create table sessions (
    uuid varchar(20) not null,

    primary key (uuid)
);
