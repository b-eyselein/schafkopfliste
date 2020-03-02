import {Group, Player} from './interfaces';
import {RuleSet} from './ruleset';

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
