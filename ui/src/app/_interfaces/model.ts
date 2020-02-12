import {Player} from './player';
import {GameType, RuleSet} from './ruleset';
import {Group} from './group';

export interface CreatableSession {
  ruleSetId: number;
  date: string;
  firstPlayerId: number;
  secondPlayerId: number;
  thirdPlayerId: number;
  fourthPlayerId: number;

}

export interface Session extends CreatableSession {
  serialNumber: number;
  groupId: number;
}

export interface SessionWithPlayersAndRuleSet {
  serialNumber: number;
  group: Group;
  firstPlayer: Player;
  secondPlayer: Player;
  thirdPlayer: Player;
  fourthPlayer: Player;
  ruleSet: RuleSet;
}

export interface Game {
  gameType: GameType;
}

export interface Selectable<T> {
  value: T;
  isSelected: boolean;
}

export function toSelectable<T>(value: T, isSelected: boolean = false): Selectable<T> {
  return {value, isSelected};
}
