import {BavarianSuitName, GameTypeName} from './game';

export interface Suit {
  name: string;
  commitableSuit: BavarianSuitName;
}

const ACORNS: Suit = {name: 'Eichel', commitableSuit: 'Acorns'};
const LEAVES: Suit = {name: 'Blatt', commitableSuit: 'Leaves'};
export const HEARTS: Suit = {name: 'Herz', commitableSuit: 'Hearts'};
const BELLS: Suit = {name: 'Schellen', commitableSuit: 'Bells'};

const RUF_SUITS: Suit[] = [ACORNS, LEAVES, BELLS];

export const SUITS: Suit[] = [ACORNS, LEAVES, HEARTS, BELLS];

export interface CreatableRuleSet {
  name: string;
}

export interface GameType {
//  id: number;
  name: GameTypeName;
  playerPartySize: number;
  needsSuit: boolean;
  canBeTout: boolean;
  isDefaultGameType: boolean;
}

export const RUF: GameType = {name: 'Ruf', playerPartySize: 2, needsSuit: true, canBeTout: true, isDefaultGameType: true};
const WENZ: GameType = {name: 'Wenz', playerPartySize: 1, needsSuit: false, canBeTout: true, isDefaultGameType: true};
const FARB_SOLO: GameType = {name: 'Farbsolo', playerPartySize: 1, needsSuit: true, canBeTout: true, isDefaultGameType: true};
const GEIER: GameType = {name: 'Geier', playerPartySize: 1, needsSuit: false, canBeTout: true, isDefaultGameType: false};
const HOCHZEIT: GameType = {name: 'Hochzeit', playerPartySize: 2, needsSuit: false, canBeTout: true, isDefaultGameType: false};
const BETTEL: GameType = {name: 'Bettel', playerPartySize: 1, needsSuit: false, canBeTout: false, isDefaultGameType: false};
const RAMSCH: GameType = {name: 'Ramsch', playerPartySize: 1, needsSuit: false, canBeTout: false, isDefaultGameType: false};
const FARB_WENZ: GameType = {name: 'Farbwenz', playerPartySize: 1, needsSuit: true, canBeTout: true, isDefaultGameType: false};
const FARB_GEIER: GameType = {name: 'Farbgeier', playerPartySize: 1, needsSuit: true, canBeTout: true, isDefaultGameType: false};

export function getSuitsForGameType(playedGame: GameType): Suit[] {
  if (!playedGame.needsSuit) {
    return [];
  } else {
    return (playedGame === RUF ? RUF_SUITS : SUITS);
  }
}

export interface RuleSet extends CreatableRuleSet {
  id: number;
  basePrice: number;
  soloPrice: number;
  countLaufende: 'Always' | 'OnlyLosers' | 'Never';
  geierAllowed: boolean;
  hochzeitAllowed: boolean;
  bettelAllowed: boolean;
  ramschAllowed: boolean;
  farbWenzAllowed: boolean;
  farbGeierAllowed: boolean;
}

export function getAllowedGameTypes(ruleSet: RuleSet): GameType[] {
  return [
    RUF, WENZ, FARB_SOLO,
    ruleSet.geierAllowed ? GEIER : null,
    ruleSet.hochzeitAllowed ? HOCHZEIT : null,
    ruleSet.bettelAllowed ? BETTEL : null,
    ruleSet.ramschAllowed ? RAMSCH : null,
    ruleSet.farbWenzAllowed ? FARB_WENZ : null,
    ruleSet.farbGeierAllowed ? FARB_GEIER : null
  ].filter((gt) => gt);
}
