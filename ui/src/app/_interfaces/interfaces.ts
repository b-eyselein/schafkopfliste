

export interface AccumulatedResult {
  balance: number;
  gameCount: number;
  playedGames: number;
  putCount: number;
  winCount: number;
}

export type BavarianSuit = 'Acorns' | 'Leaves' | 'Hearts' | 'Bells';

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
  thirdPlayer: Player;
  timeHours: number;
  timeMinutes: number;
}

export type CountLaufende = 'Always' | 'OnlyLosers' | 'Never';

export interface CreatableGroup {
  name: string;
  ruleSetId: number;
}

export interface CreatablePlayer {
  abbreviation: string;
  name: string;
  pictureName: string | undefined;
}

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

export interface Credentials {
  password: string;
  username: string;
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

export type GameType = 'Ruf' | 'Wenz' | 'Farbsolo' | 'Geier' | 'Hochzeit' | 'Bettel' | 'Ramsch' | 'Farbwenz' | 'Farbgeier';

export interface Group {
  id: number;
  name: string;
  ruleSetId: number;
}

export interface GroupWithPlayerCount {
  id: number;
  name: string;
  playerCount: number;
  ruleSetId: number;
}

export interface GroupWithPlayerMembership {
  group: Group;
  playerMemberships: PlayerAndMembership[];
}

export interface GroupWithPlayersAndRuleSet {
  id: number;
  name: string;
  players: PlayerWithGroupResult[];
  ruleSet: RuleSet;
}

export type KontraType = 'Kontra' | 'Re' | 'Supra' | 'Resupra';

export interface Player {
  abbreviation: string;
  id: number;
  name: string;
  pictureName: string | undefined;
}

export interface PlayerAndMembership {
  isMember: boolean;
  player: Player;
}

export interface PlayerWithGroupResult {
  player: Player;
  sessionResult: AccumulatedResult;
}

export interface PricedGame {
  game: Game;
  price: number;
}

export interface RegisterValues {
  password: string;
  passwordRepeat: string;
  username: string;
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

export type SchneiderSchwarz = 'Schneider' | 'Schwarz';

export interface SerializableUser {
  isAdmin: boolean;
  playerId: number | undefined;
  username: string;
}

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

export interface UserWithToken {
  token: string;
  user: SerializableUser;
}
