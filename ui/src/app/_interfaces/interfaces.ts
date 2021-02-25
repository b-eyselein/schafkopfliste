/**
 * @deprecated
 */
export type BavarianSuit = 'Acorns' | 'Leaves' | 'Hearts' | 'Bells';

/**
 * @deprecated
 */
export interface CompleteSession {
  dateDayOfMonth: number;
  dateMonth: number;
  dateYear: number;
  firstPlayer: Player;
  fourthPlayer: Player;
  group: Group;
  hasEnded: boolean;
  id: number;
  playedGames: PricedGame[];
  ruleSet: RuleSet;
  secondPlayer: Player;
  sessionResults: SessionResult[] | undefined;
  thirdPlayer: Player;
  timeHours: number;
  timeMinutes: number;
}

/**
 * @deprecated
 */
export type CountLaufende = 'Always' | 'OnlyLosers' | 'Never';

/**
 * @deprecated
 */
export interface CreatableSession {
  dateDayOfMonth: number;
  dateMonth: number;
  dateYear: number;
  firstPlayerId: number;
  fourthPlayerId: number;
  secondPlayerId: number;
  thirdPlayerId: number;
  timeHours: number;
  timeMinutes: number;
}

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
export interface Group {
  id: number;
  name: string;
  ruleSetId: number;
}

/**
 * @deprecated
 */
export type KontraType = 'Kontra' | 'Re' | 'Supra' | 'Resupra';

/**
 * @deprecated
 */
export interface Player {
  abbreviation: string;
  id: number;
  name: string;
  pictureName: string | undefined;
}

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
export interface RuleSet {
  basePrice: number;
  bettelAllowed: boolean;
  countLaufende: CountLaufende;
  farbGeierAllowed: boolean;
  farbWenzAllowed: boolean;
  geierAllowed: boolean;
  hochzeitAllowed: boolean;
  id: number;
  laufendePrice: number;
  maxLaufendeIncl: number;
  minLaufendeIncl: number;
  name: string;
  ramschAllowed: boolean;
  soloPrice: number;
}

/**
 * @deprecated
 */
export type SchneiderSchwarz = 'Schneider' | 'Schwarz';

/**
 * @deprecated
 */
export interface Session {
  creatorUsername: string;
  dateDayOfMonth: number;
  dateMonth: number;
  dateYear: number;
  firstPlayerId: number;
  fourthPlayerId: number;
  groupId: number;
  hasEnded: boolean;
  id: number;
  secondPlayerId: number;
  thirdPlayerId: number;
  timeHours: number;
  timeMinutes: number;
}

/**
 * @deprecated
 */
export interface SessionResult {
  groupId: number;
  playerId: number;
  result: number;
  sessionId: number;
}

