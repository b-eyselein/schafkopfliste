/**
 * @deprecated
 */
export type BavarianSuit = 'Acorns' | 'Leaves' | 'Hearts' | 'Bells';


/**
 * @deprecated
 */
export type CountLaufende = 'Always' | 'OnlyLosers' | 'Never';

/**
 * @deprecated
 */
export interface Game {
  actingPlayerId: number;
  gameType: GameType;
  groupId: number;
  id: number;
  isDoubled: boolean;
  kontra: KontraType | undefined;
  laufendeCount: number;
  playersHavingPutIds: number[];
  playersHavingWonIds: number[];
  schneiderSchwarz: SchneiderSchwarz | undefined;
  sessionId: number;
  suit: BavarianSuit | undefined;
  tout: boolean;
}

/**
 * @deprecated
 */
export type GameType =
  'Ruf'
  | 'Wenz'
  | 'Farbsolo'
  | 'Geier'
  | 'Hochzeit'
  | 'Bettel'
  | 'Ramsch'
  | 'Farbwenz'
  | 'Farbgeier';


/**
 * @deprecated
 */
export type KontraType = 'Kontra' | 'Re' | 'Supra' | 'Resupra';

/**
 * @deprecated
 */
export interface PricedGame {
  game: Game;
  price: number;
}

/**
 * @deprecated
 */
export type SchneiderSchwarz = 'Schneider' | 'Schwarz';
