-- Your SQL goes here

create type count_laufende as enum ('always', 'only_losers', 'never');

create table if not exists rule_sets (
    id                 serial primary key not null,
    name               varchar(100)       not null,

    count_laufende     count_laufende     not null default 'always',
    geier_allowed      boolean            not null default false,
    hochzeit_allowed   boolean            not null default false,
    bettel_allowed     boolean            not null default false,
    ramsch_allowed     boolean            not null default false,
    farb_wenz_allowed  boolean            not null default false,
    farb_geier_allowed boolean            not null default false
);

create table if not exists players (
    id           serial primary key not null,
    abbreviation varchar(5)         not null,
    name         varchar(100)       not null
);

create table if not exists users (
    username      varchar(100) primary key not null,
    password_hash varchar(100)             not null,
    player_id     integer,

    foreign key (player_id) references players (id) on update cascade on delete set null
);

create table groups (
    id                  serial primary key  not null,
    name                varchar(100) unique not null,
    default_rule_set_id integer,

    foreign key (default_rule_set_id) references rule_sets on update cascade on delete set null
);

create table if not exists player_in_groups (
    group_id  integer not null,
    player_id integer not null,

    primary key (group_id, player_id),
    foreign key (group_id) references groups (id) on update cascade on delete cascade,
    foreign key (player_id) references players (id) on update cascade on delete cascade
);


create table if not exists sessions (
    serial_number    int     not null,
    group_id         int     not null,
    date             date    not null,
    first_player_id  integer not null,
    second_player_id integer not null,
    third_player_id  integer not null,
    fourth_player_id integer not null,
    rule_set_id      integer not null,

    primary key (serial_number, group_id),
    foreign key (group_id) references groups (id) on delete cascade on update cascade,
    foreign key (first_player_id) references players (id) on update cascade on delete cascade,
    foreign key (second_player_id) references players (id) on update cascade on delete cascade,
    foreign key (third_player_id) references players (id) on update cascade on delete cascade,
    foreign key (fourth_player_id) references players (id) on update cascade on delete cascade,
    foreign key (rule_set_id) references rule_sets (id) on update cascade on delete cascade
);

create or replace view groups_with_player_count as
select g.id, g.name, g.default_rule_set_id, count(player_id) as player_count
from groups g
         left join player_in_groups pig on g.id = pig.group_id
group by g.id;

-- Inserts

insert into rule_sets (id, name, count_laufende)
values (1, 'Standard', 'always'),
       (2, 'LS 6 Info Uni Wü', 'only_losers');

insert into users (username, password_hash, player_id)
values ('default', '$2b$12$7fdsVDDPlhVmAy.ilsmyTeE7E.e2YtwI7IkQ5MGaDVsE5wDm58vGq', null);

insert into groups (id, name, default_rule_set_id)
values (1, 'LS 6 Info Uni Wue', 2);

insert into players (id, abbreviation, name)
values (1, 'BE', 'Björn Eyselein'),
       (2, 'AG', 'Alexander Gehrke'),
       (3, 'JK', 'Jonathan Krebs'),
       (4, 'MK', 'Markus Krug'),
       (5, 'CW', 'Christoph Wick');

insert into player_in_groups (group_id, player_id)
values (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (1, 5);

