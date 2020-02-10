import {Player} from './player';
import {RuleSet} from './ruleset';

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

export interface GroupWithPlayersAndRuleSet {
  id: number;
  name: string;
  default_rule_set: RuleSet | undefined;
  players: Player[];
}
