import {Player} from './player';

export interface CreatableGroup {
  name: string;
  default_rule_set_id: number | undefined;
}

export interface Group extends CreatableGroup {
  id: number;

}

export interface GroupWithPlayerCount extends Group {
  playerCount?: number;
}

export interface GroupWithPlayers {
  group: Group;
  players: Player[];
}
