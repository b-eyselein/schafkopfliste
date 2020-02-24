-- Your SQL goes here

-- @formatter:off
create type game_type as enum (
    'ruf', 'wenz', 'farbsolo', 'geier', 'hochzeit', 'bettel', 'ramsch', 'farbwenz', 'farbgeier'
);
-- @formatter:on

create type bavarian_suit as enum ('acorns', 'leaves', 'hearts', 'bells');

create type count_laufende as enum ('always', 'only_losers', 'never');

create type schneider_schwarz as enum ('schneider', 'schwarz');

create type kontra_type as enum ('kontra', 're', 'supra', 'resupra');

create table if not exists rule_sets (
    id                 serial primary key not null,
    name               varchar(100)       not null,

    base_price         integer            not null default 5,
    solo_price         integer            not null default 15,
    count_laufende     count_laufende     not null default 'always',
    min_laufende_incl  integer            not null default 2,
    max_laufende_incl  integer            not null default 4,
    laufende_price     integer            not null default 5,
    geier_allowed      boolean            not null default false,
    hochzeit_allowed   boolean            not null default false,
    bettel_allowed     boolean            not null default false,
    ramsch_allowed     boolean            not null default false,
    farb_wenz_allowed  boolean            not null default false,
    farb_geier_allowed boolean            not null default false
);

create table if not exists players (
    id           serial primary key not null,
    abbreviation varchar(5) unique  not null,
    name         varchar(100)       not null
);

alter sequence players_id_seq restart with 1000;

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
    id               integer      not null,
    group_id         integer      not null,
    date             date         not null,
    time             time         not null,
    has_ended        bool         not null default false,
    first_player_id  integer      not null,
    second_player_id integer      not null,
    third_player_id  integer      not null,
    fourth_player_id integer      not null,
    rule_set_id      integer      not null,
    creator_username varchar(100) not null,

    primary key (id, group_id),
    foreign key (group_id) references groups (id) on delete cascade on update cascade,
    foreign key (first_player_id) references players (id) on update cascade on delete cascade,
    foreign key (second_player_id) references players (id) on update cascade on delete cascade,
    foreign key (third_player_id) references players (id) on update cascade on delete cascade,
    foreign key (fourth_player_id) references players (id) on update cascade on delete cascade,
    foreign key (rule_set_id) references rule_sets (id) on update cascade on delete cascade,
    foreign key (creator_username) references users (username) on update cascade on delete cascade
);

create table if not exists games (
    id                     integer   not null,
    session_id             integer   not null,
    group_id               integer   not null,

    acting_player_id       integer   not null,
    game_type              game_type not null,
    suit                   bavarian_suit,
    tout                   boolean   not null default false,

    is_doubled             bool      not null default false,
    laufende_count         integer   not null default 0,
    schneider_schwarz      schneider_schwarz  default null,

    players_having_put_ids integer[] not null default '{}',
    kontra                 kontra_type        default null,
    players_having_won_ids integer[] not null default '{}',
    price                  integer   not null,

    primary key (id, session_id, group_id),
    foreign key (acting_player_id) references players (id) on update cascade on delete cascade,
    foreign key (session_id, group_id) references sessions (id, group_id) on update cascade on delete cascade
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

insert into players (abbreviation, name)
values ('BE', 'Björn Eyselein'),
       ('AG', 'Alexander Gehrke'),
       ('JK', 'Jonathan Krebs'),
       ('MK', 'Markus Krug'),
       ('CW', 'Christoph Wick'),
       ('AHe', 'Amar Hekalo'),
       ('AHa', 'Alexander Hartelt'),
       ('MI', 'Marianus Ifland'),
       ('CR', 'Christian Reul');

insert into player_in_groups (group_id, player_id)
values (1, 1000),
       (1, 1001),
       (1, 1002),
       (1, 1003),
       (1, 1004),
       (1, 1005),
       (1, 1006),
       (1, 1007),
       (1, 1008);
