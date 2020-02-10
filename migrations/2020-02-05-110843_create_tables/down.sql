-- This file should undo anything in `up.sql`

-- drop table if exists allowed_game_type_in_sessions;

drop view if exists groups_with_player_count;

drop table if exists sessions;

drop table if exists rule_sets;

drop table if exists player_in_groups;

drop table if exists groups;

drop table if exists users;

drop table if exists players;

drop type if exists count_laufende;
