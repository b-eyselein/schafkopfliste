import {Group, Player, RuleSet} from './interfaces';

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
