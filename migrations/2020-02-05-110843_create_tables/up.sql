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
    player_id     integer                  references players (id) on update cascade on delete set null
);

create table groups (
    id                  serial primary key  not null,
    name                varchar(100) unique not null,
    default_rule_set_id integer             references rule_sets on update cascade on delete set null
);

create table if not exists player_in_groups (
    group_id     integer not null references groups (id) on update cascade on delete cascade,
    player_id    integer not null references players (id) on update cascade on delete cascade,

    balance      integer not null default 0,
    game_count   integer not null default 0,
    put_count    integer not null default 0,
    played_games integer not null default 0,
    win_count    integer not null default 0,

    primary key (group_id, player_id)
);

create table if not exists sessions (
    id                integer      not null,
    group_id          integer      not null references groups (id) on update cascade on delete cascade,
    date_year         integer      not null check (2000 <= date_year and date_year <= 3000),
    date_month        integer      not null check (1 <= date_month and date_month <= 12),
    date_day_of_month integer      not null check (1 <= date_day_of_month and date_day_of_month <= 31),
    time_hours        integer      not null check (0 <= time_hours and time_hours <= 23),
    time_minutes      integer      not null check (0 <= time_minutes and time_minutes <= 59),
    has_ended         bool         not null default false,
    first_player_id   integer      not null references players (id) on update cascade on delete cascade,
    second_player_id  integer      not null references players (id) on update cascade on delete cascade,
    third_player_id   integer      not null references players (id) on update cascade on delete cascade,
    fourth_player_id  integer      not null references players (id) on update cascade on delete cascade,
    rule_set_id       integer      not null references rule_sets (id) on update cascade on delete cascade,
    creator_username  varchar(100) not null references users (username) on update cascade on delete cascade,

    primary key (id, group_id)
);

create table if not exists games (
    id                     integer   not null,
    session_id             integer   not null,
    group_id               integer   not null,

    acting_player_id       integer   not null references players (id) on update cascade on delete cascade,
    game_type              game_type not null,
    suit                   bavarian_suit,
    tout                   boolean   not null default false,

    is_doubled             bool      not null default false,
    laufende_count         integer   not null default 0,
    schneider_schwarz      schneider_schwarz  default null,

    players_having_put_ids integer[] not null default '{}',
    kontra                 kontra_type        default null,
    players_having_won_ids integer[] not null default '{}',

    primary key (id, session_id, group_id),
    foreign key (session_id, group_id) references sessions (id, group_id) on update cascade on delete cascade
);

create or replace view groups_with_player_count as
select g.id, g.name, g.default_rule_set_id, count(player_id) as player_count
from groups g
         left join player_in_groups pig on g.id = pig.group_id
group by g.id;
