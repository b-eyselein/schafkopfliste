import {Player} from './player';
import {RuleSet} from './ruleset';
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
  id: number;
  groupId: number;
}

export interface CompleteSession {
  id: number;
  group: Group;
  firstPlayer: Player;
  secondPlayer: Player;
  thirdPlayer: Player;
  fourthPlayer: Player;
  ruleSet: RuleSet;
  playedGames: Game[];
}

export type BavarianSuitName = 'Acorns' | 'Leaves' | 'Hearts' | 'Bells';

export type GameTypeName = 'Ruf'
  | 'Wenz'
  | 'Farbsolo'
  | 'Geier'
  | 'Ramsch'
  | 'Bettel'
  | 'Hochzeit'
  | 'Farbwenz'
  | 'Farbgeier';

export type SchneiderSchwarz = 'Schneider' | 'Schwarz';

export interface Game {
  id: number;
  sessionId: number;
  groupId: number;

  actingPlayerId: number;
  gameType: GameTypeName;
  suit: BavarianSuitName | undefined;

  isDoubled: boolean;
  laufendeCount: number;
  schneiderSchwarz: SchneiderSchwarz | undefined;

  playersHavingPut: { Left: number } | { Right: number[] };
  playersWithContra: { Left: number } | { Right: number[] };
  playersHavingWonIds: number[];
}
