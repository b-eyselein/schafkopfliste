import {CountLaufende} from './ruleset';

export interface Credentials {
  password: string;
  username: string;
}

export interface UserWithToken {
  name: string;
  token: string;
}

export interface CreatablePlayer {
  abbreviation: string;
  name: string;
}

export interface Player {
  abbreviation: string;
  id: number;
  name: string;
}

export interface RuleSet {
  basePrice: number;
  bettelAllowed: boolean;
  countLaufende: any;
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

export interface PricedGame {
  game: Game;
  price: number;
}

export interface Game {
  actingPlayerId: number;
  gameType: any;
  groupId: number;
  id: number;
  isDoubled: boolean;
  kontra: any | undefined;
  laufendeCount: number;
  playersHavingPutIds: number[];
  playersHavingWonIds: number[];
  schneiderSchwarz: any | undefined;
  sessionId: number;
  suit: any | undefined;
  tout: boolean;
}

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

export interface Player {
  abbreviation: string;
  id: number;
  name: string;
}

export interface Player {
  abbreviation: string;
  id: number;
  name: string;
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

export interface Game {
  actingPlayerId: number;
  gameType: any;
  groupId: number;
  id: number;
  isDoubled: boolean;
  kontra: any | undefined;
  laufendeCount: number;
  playersHavingPutIds: number[];
  playersHavingWonIds: number[];
  schneiderSchwarz: any | undefined;
  sessionId: number;
  suit: any | undefined;
  tout: boolean;
}

export interface RuleSet {
  basePrice: number;
  bettelAllowed: boolean;
  countLaufende: any;
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

export interface Player {
  abbreviation: string;
  id: number;
  name: string;
}

export interface Player {
  abbreviation: string;
  id: number;
  name: string;
}

export interface CreatableGroup {
  defaultRuleSetId: number | undefined;
  name: string;
}

export interface Group {
  defaultRuleSetId: number | undefined;
  id: number;
  name: string;
}
