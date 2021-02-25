-- Your SQL goes here

-- @formatter:off
create type game_type as enum (
    'ruf', 'wenz', 'farbsolo', 'geier', 'hochzeit',
    'bettel', 'ramsch', 'farbwenz', 'farbgeier'
);
-- @formatter:on

create type bavarian_suit as enum ('acorns', 'leaves', 'hearts', 'bells');

create type count_laufende as enum ('always', 'only_losers', 'never');

create type schneider_schwarz as enum ('schneider', 'schwarz');

create type kontra_type as enum ('kontra', 're', 'supra', 'resupra');

create type table_position as enum ('dealer', 'pre_hand', 'middle_hand', 'rear_hand');


create table if not exists rule_sets (
    name               varchar(100) primary key,

    base_price         integer        not null default 5,
    solo_price         integer        not null default 15,

    count_laufende     count_laufende not null default 'always',
    min_laufende_incl  integer        not null default 2,
    max_laufende_incl  integer        not null default 4,
    laufende_price     integer        not null default 5,

    geier_allowed      boolean        not null default false,
    hochzeit_allowed   boolean        not null default false,
    bettel_allowed     boolean        not null default false,
    ramsch_allowed     boolean        not null default false,
    farb_wenz_allowed  boolean        not null default false,
    farb_geier_allowed boolean        not null default false
);

create table if not exists players (
    abbreviation varchar(10) primary key,
    name         varchar(100) not null,
    picture_name varchar(255)
);

create table if not exists users (
    username            varchar(100) primary key,
    password_hash       varchar(100) not null,
    is_admin            bool         not null default false,
    player_abbreviation varchar(10)  references players (abbreviation) on update cascade on delete set null
);

create table groups (
    name          varchar(100) primary key,
    rule_set_name varchar(100) not null references rule_sets (name) on update cascade on delete set null
);

create table if not exists player_in_groups (
    group_name          varchar(100) not null references groups (name) on update cascade on delete cascade,
    player_abbreviation varchar(10)  not null references players (abbreviation) on update cascade on delete cascade,

    balance             integer      not null default 0,
    game_count          integer      not null default 0,
    put_count           integer      not null default 0,
    played_games        integer      not null default 0,
    win_count           integer      not null default 0,

    is_active           bool         not null default true,

    primary key (group_name, player_abbreviation)
);

create table if not exists sessions (
    id                         integer,
    group_name                 varchar(100) references groups (name) on update cascade on delete cascade,

    date_year                  integer      not null check (2000 <= date_year and date_year <= 3000),
    date_month                 integer      not null check (1 <= date_month and date_month <= 12),
    date_day_of_month          integer      not null check (1 <= date_day_of_month and date_day_of_month <= 31),
    time_hours                 integer      not null check (0 <= time_hours and time_hours <= 23),
    time_minutes               integer      not null check (0 <= time_minutes and time_minutes <= 59),

    has_ended                  bool         not null default false,

    first_player_abbreviation  varchar(10)  not null,
    second_player_abbreviation varchar(10)  not null,
    third_player_abbreviation  varchar(10)  not null,
    fourth_player_abbreviation varchar(10)  not null,

    creator_username           varchar(100) not null references users (username) on update cascade on delete cascade,

    primary key (id, group_name),
    foreign key (group_name, first_player_abbreviation) references player_in_groups (group_name, player_abbreviation) on update cascade on delete cascade,
    foreign key (group_name, second_player_abbreviation) references player_in_groups (group_name, player_abbreviation) on update cascade on delete cascade,
    foreign key (group_name, third_player_abbreviation) references player_in_groups (group_name, player_abbreviation) on update cascade on delete cascade,
    foreign key (group_name, fourth_player_abbreviation) references player_in_groups (group_name, player_abbreviation) on update cascade on delete cascade
);

create table if not exists session_results (
    player_abbreviation varchar(10),
    session_id          integer,
    group_name          varchar(100),
    result              integer not null,

    primary key (player_abbreviation, session_id, group_name),
    foreign key (session_id, group_name) references sessions (id, group_name) on update cascade on delete cascade,
    foreign key (group_name, player_abbreviation) references player_in_groups (group_name, player_abbreviation) on update cascade on delete cascade
);

create table if not exists games (
    id                               integer,
    session_id                       integer,
    group_name                       varchar(100),

    acting_player_abbreviation       varchar(10) not null,
    game_type                        game_type   not null,
    suit                             bavarian_suit,
    tout                             boolean     not null default false,

    is_doubled                       bool        not null default false,
    laufende_count                   integer     not null default 0,
    schneider_schwarz                schneider_schwarz    default null,

    players_having_put_abbreviations text[]      not null default '{}',
    kontra                           kontra_type          default null,
    players_having_won_abbreviations text[]      not null default '{}',

    primary key (id, session_id, group_name),
    foreign key (session_id, group_name) references sessions (id, group_name) on update cascade on delete cascade,
    foreign key (group_name, acting_player_abbreviation) references player_in_groups (group_name, player_abbreviation) on update cascade on delete cascade
);
