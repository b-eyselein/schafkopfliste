export type KontraType = 'Kontra' | 'Re' | 'Supra' | 'Resupra';
export const KontraTypeValues: KontraType[] = ['Kontra', 'Re', 'Supra', 'Resupra'];

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
export const SchneiderSchwarzValues: SchneiderSchwarz[] = ['Schneider', 'Schwarz'];


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
  kontra: KontraType | undefined;
  playersHavingWonIds: number[];
}

export interface PricedGame extends Game {
  price: number;
}
