-- Your SQL goes here

create table players (
    username     varchar(100) not null,
    abbreviation varchar(5)   not null,
    name         varchar(100) not null,

    primary key (username)
);

insert into players (username, abbreviation, name)
values ('b_eyselein', 'BE', 'Björn Eyselein');

create table game_types (
    id                   integer     not null,
    name                 varchar(20) not null,
    is_default_game_type boolean     not null,

    primary key (id)
);

insert into game_types (id, name, is_default_game_type)
values (1, 'Ruf', true),
       (2, 'Wenz', true),
       (3, 'Farbsolo', true),
       (4, 'Geier', false),
       (5, 'Bettel', false),
       (6, 'Ramsch', false),
       (7, 'Hochzeit', false),
       (9, 'Farbwenz', false);

create table sessions (
    uuid                   varchar(20)  not null,
    date                   date         not null,
    first_player_username  varchar(100) not null,
    second_player_username varchar(100) not null,
    third_player_username  varchar(100) not null,
    fourth_player_username varchar(100) not null,

    primary key (uuid),
    foreign key (first_player_username)
        references players (abbreviation)
        on update cascade on delete cascade,
    foreign key (second_player_username)
        references players (abbreviation)
        on update cascade on delete cascade,
    foreign key (third_player_username)
        references players (abbreviation)
        on update cascade on delete cascade,
    foreign key (fourth_player_username)
        references players (abbreviation)
        on update cascade on delete cascade
);

create table allowed_game_type_in_sessions (
    session_uuid varchar(20) not null,
    game_type_id integer     not null,

    primary key (session_uuid, game_type_id)
);
