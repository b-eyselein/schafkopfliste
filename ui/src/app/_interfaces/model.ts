import {Player} from './interfaces';
import {RuleSet} from './ruleset';
import {Group} from './interfaces';
import {Game} from './game';

export interface CreatableSession {
  ruleSetId: number;
  date: string;
  time: string;
  firstPlayerId: number;
  secondPlayerId: number;
  thirdPlayerId: number;
  fourthPlayerId: number;
}

export interface Session extends CreatableSession {
  id: number;
  groupId: number;
}

export interface CompleteSession {
  id: number;
  date: string;
  time: string;
  group: Group;
  firstPlayer: Player;
  secondPlayer: Player;
  thirdPlayer: Player;
  fourthPlayer: Player;
  ruleSet: RuleSet;
  playedGames: Game[];
}

export function playersForSession(s: CompleteSession): Player[] {
  return [s.firstPlayer, s.secondPlayer, s.thirdPlayer, s.fourthPlayer];
}


