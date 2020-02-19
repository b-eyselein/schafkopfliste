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
  playedGames: PricedGame[];
}

export function playersForSession(s: CompleteSession): Player[] {
  return [s.firstPlayer, s.secondPlayer, s.thirdPlayer, s.fourthPlayer];
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

/*
export interface Either<T, U> {

}
 */

export type Either<T, U> = Left<T, U> | Right<T, U>;

export interface Left<T, U> {
  Left: T;
}

export function isLeft<T, U>(e: Either<T, U>): e is Left<T, U> {
  return 'Left' in e;
}

export interface Right<T, U> {
  Right: U;
}

export function isRight<T, U>(e: Either<T, U>): e is Right<T, U> {
  return 'Right' in e;
}

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

  playersHavingPut: Either<number, number[]>;
  playersWithContra: Either<number, number[]>;
  playersHavingWonIds: number[];
}

export interface PricedGame extends Game {
  price: number;
}
