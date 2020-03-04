import {BavarianSuit, GameType, RuleSet} from './interfaces';

export interface Suit {
  name: string;
  commitableSuit: BavarianSuit;
}

const ACORNS: Suit = {name: 'Eichel', commitableSuit: 'Acorns'};
const LEAVES: Suit = {name: 'Blatt', commitableSuit: 'Leaves'};
export const HEARTS: Suit = {name: 'Herz', commitableSuit: 'Hearts'};
const BELLS: Suit = {name: 'Schellen', commitableSuit: 'Bells'};

const RUF_SUITS: Suit[] = [ACORNS, LEAVES, BELLS];

export const SUITS: Suit[] = [ACORNS, LEAVES, HEARTS, BELLS];

export interface CompleteGameType {
  name: GameType;
  playerPartySize: number;
  needsSuit: boolean;
  canBeTout: boolean;
  isDefaultGameType: boolean;
}

export const RUF: CompleteGameType = {
  name: 'Ruf',
  playerPartySize: 2,
  needsSuit: true,
  canBeTout: true,
  isDefaultGameType: true
};

const WENZ: CompleteGameType = {name: 'Wenz', playerPartySize: 1, needsSuit: false, canBeTout: true, isDefaultGameType: true};

const FARB_SOLO: CompleteGameType = {
  name: 'Farbsolo',
  playerPartySize: 1,
  needsSuit: true,
  canBeTout: true,
  isDefaultGameType: true
};

const GEIER: CompleteGameType = {
  name: 'Geier',
  playerPartySize: 1,
  needsSuit: false,
  canBeTout: true,
  isDefaultGameType: false
};

const HOCHZEIT: CompleteGameType = {
  name: 'Hochzeit',
  playerPartySize: 2,
  needsSuit: false,
  canBeTout: true,
  isDefaultGameType: false
};

const BETTEL: CompleteGameType = {
  name: 'Bettel',
  playerPartySize: 1,
  needsSuit: false,
  canBeTout: false,
  isDefaultGameType: false
};

const RAMSCH: CompleteGameType = {
  name: 'Ramsch',
  playerPartySize: 1,
  needsSuit: false,
  canBeTout: false,
  isDefaultGameType: false
};

const FARB_WENZ: CompleteGameType = {
  name: 'Farbwenz',
  playerPartySize: 1,
  needsSuit: true,
  canBeTout: true,
  isDefaultGameType: false
};

const FARB_GEIER: CompleteGameType = {
  name: 'Farbgeier',
  playerPartySize: 1,
  needsSuit: true,
  canBeTout: true,
  isDefaultGameType: false
};

export function getSuitsForGameType(playedGame: CompleteGameType): Suit[] {
  if (!playedGame.needsSuit) {
    return [];
  } else {
    return (playedGame === RUF ? RUF_SUITS : SUITS);
  }
}

export function getAllowedGameTypes(ruleSet: RuleSet): CompleteGameType[] {
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
