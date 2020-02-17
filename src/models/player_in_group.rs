use diesel::{self, prelude::*, PgConnection};
use serde::Serialize;

use crate::models::group::Group;
use crate::models::player::{select_players, Player};
use crate::models::rule_set::{select_rule_set_by_id, RuleSet};
use crate::schema::player_in_groups;

table! {
    groups_with_player_count (id) {
        id -> Int4,
        name -> Varchar,
        default_rule_set_id -> Nullable<Int4>,
        player_count -> BigInt,
    }
}

#[derive(Debug, Queryable, Insertable)]
pub struct PlayerInGroup {
    group_id: i32,
    player_id: i32,
}

impl PlayerInGroup {
    pub fn new(group_id: i32, player_id: i32) -> PlayerInGroup {
        PlayerInGroup {
            group_id,
            player_id,
        }
    }
}

#[derive(Debug, Serialize, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct GroupWithPlayerCount {
    id: i32,
    name: String,
    default_rule_set_id: Option<i32>,
    player_count: i64,
}

#[derive(Debug, Serialize)]
pub struct GroupWithPlayersAndRuleSet {
    id: i32,
    name: String,
    default_rule_set: Option<RuleSet>,
    players: Vec<Player>,
}

impl GroupWithPlayersAndRuleSet {
    pub fn new(
        id: i32,
        name: String,
        default_rule_set: Option<RuleSet>,
        players: Vec<Player>,
    ) -> GroupWithPlayersAndRuleSet {
        GroupWithPlayersAndRuleSet {
            id,
            name,
            default_rule_set,
            players,
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerAndMembership {
    player: Player,
    is_member: bool,
}

pub fn select_groups_with_player_count(conn: &PgConnection) -> Vec<GroupWithPlayerCount> {
    groups_with_player_count::table
        .load::<GroupWithPlayerCount>(conn)
        .unwrap_or(Vec::new())
}

pub fn select_players_in_group(conn: &PgConnection, the_group_id: &i32) -> Vec<Player> {
    use crate::schema::player_in_groups::dsl::*;
    use crate::schema::players::dsl::*;

    player_in_groups
        .filter(group_id.eq(the_group_id))
        .inner_join(players)
        .select((id, abbreviation, name))
        .load::<Player>(conn)
        .unwrap_or(Vec::new())
}

pub fn select_group_with_players_and_rule_set_by_id(
    conn: &PgConnection,
    the_group_id: &i32,
) -> Option<GroupWithPlayersAndRuleSet> {
    use crate::models::group::select_group_by_id;

    select_group_by_id(conn, the_group_id).map(|g| {
        let default_rule_set = g
            .default_rule_set_id
            .and_then(|id| select_rule_set_by_id(conn, &id));

        GroupWithPlayersAndRuleSet::new(
            g.id,
            g.name,
            default_rule_set,
            select_players_in_group(conn, the_group_id),
        )
    })
}

pub fn add_player_to_group(conn: &PgConnection, group_id: i32, player_id: i32) -> bool {
    let inserted_count = diesel::insert_into(player_in_groups::table)
        .values(PlayerInGroup::new(group_id, player_id))
        .execute(conn);

    match inserted_count {
        Ok(1) => true,
        _ => false,
    }
}

#[allow(dead_code)]
pub fn select_groups_for_player(
    conn: &PgConnection,
    the_player_id: &i32,
) -> Vec<(PlayerInGroup, Group)> {
    use crate::schema::groups::dsl::*;
    use crate::schema::player_in_groups::dsl::*;

    player_in_groups
        .filter(player_id.eq(the_player_id))
        .inner_join(groups)
        .load::<(PlayerInGroup, Group)>(conn)
        .unwrap_or(Vec::new())
}

pub fn select_players_and_group_membership(
    conn: &PgConnection,
    the_group_id: &i32,
) -> Vec<PlayerAndMembership> {
    let player_ids_in_group: Vec<i32> = player_in_groups::table
        .filter(player_in_groups::group_id.eq(the_group_id))
        .select(player_in_groups::player_id)
        .load(conn)
        .unwrap_or(Vec::new());

    select_players(conn)
        .into_iter()
        .map(|p| {
            let is_in_group = player_ids_in_group.contains(&p.id);
            PlayerAndMembership {
                player: p,
                is_member: is_in_group,
            }
        })
        .collect()
}
