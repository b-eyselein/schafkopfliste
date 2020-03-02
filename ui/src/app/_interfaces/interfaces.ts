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

export interface CreatableGroup {
  defaultRuleSetId: number | undefined;
  name: string;
}

export interface Group {
  defaultRuleSetId: number | undefined;
  id: number;
  name: string;
}
