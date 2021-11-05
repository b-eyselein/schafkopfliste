-- Your SQL goes here

create type game_type as enum ( 'ruf', 'wenz', 'farbsolo', 'geier', 'hochzeit', 'bettel', 'ramsch', 'farbwenz', 'farbgeier');

create type bavarian_suit as enum ('acorns', 'leaves', 'hearts', 'bells');

create type count_laufende as enum ('always', 'only_losers', 'never');

create type schneider_schwarz as enum ('schneider', 'schwarz');

create type kontra_type as enum ('kontra', 're', 'supra', 'resupra');

create type table_position as enum ('dealer', 'pre_hand', 'middle_hand', 'rear_hand');


create table if not exists users (
  username      varchar(100) primary key,
  password_hash varchar(100) not null
);

create table groups (
  id             serial primary key,
  owner_username varchar(100) not null references users (username) on update cascade on delete cascade,
  name           varchar(100) not null
);

create table if not exists group_other_admins (
  group_id      integer references groups (id) on update cascade on delete cascade,
  user_username varchar(100) references users (username) on update cascade on delete cascade,

  primary key (group_id, user_username)
);

create table if not exists rule_sets (
  group_id           integer references groups (id) on update cascade on delete cascade,
  name               varchar(100),

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
  farb_geier_allowed boolean        not null default false,

  primary key (group_id, name)
);

create table if not exists players (
  group_id     integer     not null,
  nickname     varchar(20) not null,

  name         varchar(100),

  balance      integer     not null default 0,
  game_count   integer     not null default 0,
  put_count    integer     not null default 0,
  played_games integer     not null default 0,
  win_count    integer     not null default 0,

  primary key (group_id, nickname),
  foreign key (group_id) references groups (id) on update cascade on delete cascade
);

create table if not exists sessions (
  group_id               integer      not null,
  id                     integer,

  date                   date         not null default now()::date,
  time                   time         not null default now()::time,

  rule_set_name          varchar(100) not null,

  has_ended              bool         not null default false,

  first_player_nickname  varchar(20)  not null,
  second_player_nickname varchar(20)  not null,
  third_player_nickname  varchar(20)  not null,
  fourth_player_nickname varchar(20)  not null,

  -- null means created by owner of group
  other_creator_username varchar(100),

  primary key (group_id, id),

  -- transitiv: foreign key (group_id) references groups (id) on update cascade on delete cascade,

  foreign key (group_id, rule_set_name) references rule_sets (group_id, name) on update cascade on delete cascade,

  foreign key (group_id, first_player_nickname) references players (group_id, nickname) on update cascade on delete cascade,
  foreign key (group_id, second_player_nickname) references players (group_id, nickname) on update cascade on delete cascade,
  foreign key (group_id, third_player_nickname) references players (group_id, nickname) on update cascade on delete cascade,
  foreign key (group_id, fourth_player_nickname) references players (group_id, nickname) on update cascade on delete cascade,

  foreign key (group_id, other_creator_username) references group_other_admins (group_id, user_username) on update cascade on delete cascade
);

create table if not exists session_results (
  group_id        integer not null,
  player_nickname varchar(20),
  session_id      integer,
  result          integer not null,

  primary key (group_id, player_nickname, session_id),
  foreign key (group_id, session_id) references sessions (group_id, id) on update cascade on delete cascade,
  foreign key (group_id, player_nickname) references players (group_id, nickname) on update cascade on delete cascade
);

create table if not exists games (
  group_id                     integer     not null,
  session_id                   integer     not null,
  id                           integer     not null,

  acting_player_nickname       varchar(20) not null,
  game_type                    game_type   not null,
  suit                         bavarian_suit,
  tout                         boolean     not null default false,

  is_doubled                   bool        not null default false,
  laufende_count               integer     not null default 0,
  schneider_schwarz            schneider_schwarz    default null,

  players_having_put_nicknames text[]      not null default '{}',
  kontra                       kontra_type          default null,
  players_having_won_nicknames text[]      not null default '{}',

  primary key (group_id, session_id, id),
  foreign key (group_id, session_id) references sessions (group_id, id) on update cascade on delete cascade,
  foreign key (group_id, acting_player_nickname) references players (group_id, nickname) on update cascade on delete cascade
);
