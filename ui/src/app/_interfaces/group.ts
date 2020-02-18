import {Player} from './player';
import {RuleSet} from './ruleset';

export interface CreatableGroup {
  name: string;
  defaultRuleSetId: number | undefined;
}

export interface Group extends CreatableGroup {
  id: number;

}

export interface GroupWithPlayerCount extends Group {
  playerCount?: number;
}

export interface GroupWithPlayersAndRuleSet {
  id: number;
  name: string;
  defaultRuleSet: RuleSet | undefined;
  players: Player[];
}

export interface GroupWithPlayersAndMembership {
  group: Group;
  players: {
    player: Player;
    isMember: boolean;
  }[];
}
