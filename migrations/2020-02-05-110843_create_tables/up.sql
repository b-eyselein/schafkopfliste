-- Your SQL goes here

create table groups (
    id   integer      not null,
    name varchar(100) not null,

    primary key (id)
);

create table player_with_passwords (
    username      varchar(100) not null,
    abbreviation  varchar(5)   not null,
    name          varchar(100) not null,
    password_hash varchar(100) not null,

    primary key (username)
);

create table player_in_groups (
    group_id        integer      not null,
    player_username varchar(100) not null,

    primary key (group_id, player_username),
    foreign key (group_id) references groups (id) on update cascade on delete cascade,
    foreign key (player_username) references player_with_passwords (username) on update cascade on delete cascade
);

create table rule_sets (
    id                 integer      not null,
    name               varchar(100) not null,

    geier_allowed      boolean      not null default false,
    hochzeit_allowed   boolean      not null default false,
    bettel_allowed     boolean      not null default false,
    ramsch_allowed     boolean      not null default false,
    farb_wenz_allowed  boolean      not null default false,
    farb_geier_allowed boolean      not null default false,

    primary key (id)
);

create table sessions (
    uuid                   varchar(20)  not null,
    date                   date         not null,
    first_player_username  varchar(100) not null,
    second_player_username varchar(100) not null,
    third_player_username  varchar(100) not null,
    fourth_player_username varchar(100) not null,
    rule_set_id            integer      not null,

    primary key (uuid),
    foreign key (first_player_username) references player_with_passwords (abbreviation) on update cascade on delete cascade,
    foreign key (second_player_username) references player_with_passwords (abbreviation) on update cascade on delete cascade,
    foreign key (third_player_username) references player_with_passwords (abbreviation) on update cascade on delete cascade,
    foreign key (fourth_player_username) references player_with_passwords (abbreviation) on update cascade on delete cascade,
    foreign key (rule_set_id) references rule_sets (id) on update cascade on delete cascade
);

-- Inserts

insert into groups (id, name)
values (1, 'LS 6 Info Uni Wue');

insert into player_with_passwords (username, abbreviation, name, password_hash)
values ('b_eyselein', 'BE', 'Björn Eyselein', '$2b$12$7fdsVDDPlhVmAy.ilsmyTeE7E.e2YtwI7IkQ5MGaDVsE5wDm58vGq');

insert into player_in_groups
values (1, 'b_eyselein');
