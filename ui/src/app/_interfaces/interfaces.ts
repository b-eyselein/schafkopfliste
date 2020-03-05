

export interface UserWithToken {
  name: string;
  token: string;
}

export type CountLaufende = 'Always' | 'OnlyLosers' | 'Never';

export interface CompleteSession {
  dateDayOfMonth: number;
  dateMonth: number;
  dateYear: number;
  firstPlayer: Player;
  fourthPlayer: Player;
  group: Group;
  id: number;
  playedGames: PricedGame[];
  ruleSet: RuleSet;
  secondPlayer: Player;
  thirdPlayer: Player;
  timeHours: number;
  timeMinutes: number;
}

export interface Credentials {
  password: string;
  username: string;
}

export type SchneiderSchwarz = 'Schneider' | 'Schwarz';

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
  ruleSetId: number;
  secondPlayerId: number;
  thirdPlayerId: number;
  timeHours: number;
  timeMinutes: number;
}

export interface CreatableGroup {
  defaultRuleSetId: number | undefined;
  name: string;
}

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

export type KontraType = 'Kontra' | 'Re' | 'Supra' | 'Resupra';

export interface CreatableSession {
  dateDayOfMonth: number;
  dateMonth: number;
  dateYear: number;
  firstPlayerId: number;
  fourthPlayerId: number;
  ruleSetId: number;
  secondPlayerId: number;
  thirdPlayerId: number;
  timeHours: number;
  timeMinutes: number;
}

export type BavarianSuit = 'Acorns' | 'Leaves' | 'Hearts' | 'Bells';

export interface Player {
  abbreviation: string;
  id: number;
  name: string;
}

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

export interface GroupWithPlayerMembership {
  group: Group;
  playerMemberships: PlayerAndMembership[];
}

export interface Group {
  defaultRuleSetId: number | undefined;
  id: number;
  name: string;
}

export interface PricedGame {
  game: Game;
  price: number;
}

export type GameType = 'Ruf' | 'Wenz' | 'Farbsolo' | 'Geier' | 'Hochzeit' | 'Bettel' | 'Ramsch' | 'Farbwenz' | 'Farbgeier';

export interface CreatablePlayer {
  abbreviation: string;
  name: string;
}

export interface PlayerAndMembership {
  isMember: boolean;
  player: Player;
}
