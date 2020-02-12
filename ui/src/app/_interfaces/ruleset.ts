import {SelectableValue, toSelectableValue} from './selectable-value';

export interface Suit {
  name: string;
  germanName: string;
}

const ACORNS: Suit = {name: 'ACORNS', germanName: 'Eichel'};
const LEAVES: Suit = {name: 'LEAVES', germanName: 'Blatt'};
const HEARTS: Suit = {name: 'HEARTS', germanName: 'Herz'};
const BELLS: Suit = {name: 'BELLS', germanName: 'Schellen'};

const RUF_SUITS: Suit[] = [ACORNS, LEAVES, BELLS];

const SUITS: Suit[] = [ACORNS, LEAVES, HEARTS, BELLS];

export interface CreatableRuleSet {
  name: string;
}

export interface GameType {
//  id: number;
  name: string;
  playerPartySize: number;
  needsSuit: boolean;
  isDefaultGameType: boolean;
}

const RUF: GameType = {name: 'Ruf', playerPartySize: 2, needsSuit: true, isDefaultGameType: true};
const WENZ: GameType = {name: 'Wenz', playerPartySize: 1, needsSuit: false, isDefaultGameType: true};
const FARB_SOLO: GameType = {name: 'Farbsolo', playerPartySize: 1, needsSuit: true, isDefaultGameType: true};
const GEIER: GameType = {name: 'Geier', playerPartySize: 1, needsSuit: false, isDefaultGameType: false};
const HOCHZEIT: GameType = {name: 'Hochzeit', playerPartySize: 2, needsSuit: false, isDefaultGameType: false};
const BETTEL: GameType = {name: 'Bettel', playerPartySize: 1, needsSuit: false, isDefaultGameType: false};
const RAMSCH: GameType = {name: 'Ramsch', playerPartySize: 1, needsSuit: false, isDefaultGameType: false};
const FARB_WENZ: GameType = {name: 'Farbwenz', playerPartySize: 1, needsSuit: true, isDefaultGameType: false};
const FARB_GEIER: GameType = {name: 'Farbgeier', playerPartySize: 1, needsSuit: true, isDefaultGameType: false};

export function getSuitsForGameType(playedGame: GameType): SelectableValue<Suit>[] {
  return (playedGame === RUF ? RUF_SUITS : SUITS)
    .map((gt) => toSelectableValue(gt, gt.germanName, false));
}


export interface RuleSet extends CreatableRuleSet {
  id: number;
  countLaufende: 'Always' | 'OnlyLosers' | 'Never';
  geierAllowed: boolean;
  hochzeitAllowed: boolean;
  bettelAllowed: boolean;
  ramschAllowed: boolean;
  farbWenzAllowed: boolean;
  farbGeierAllowed: boolean;
}

export function getAllowedGameTypes(ruleSet: RuleSet): SelectableValue<GameType>[] {
  const maybeGameTypes = [
    RUF, WENZ, FARB_SOLO,
    ruleSet.geierAllowed ? GEIER : null,
    ruleSet.hochzeitAllowed ? HOCHZEIT : null,
    ruleSet.bettelAllowed ? BETTEL : null,
    ruleSet.ramschAllowed ? RAMSCH : null,
    ruleSet.farbWenzAllowed ? FARB_WENZ : null,
    ruleSet.farbGeierAllowed ? FARB_GEIER : null
  ];

  return maybeGameTypes
    .filter((gt) => gt)
    .map((gt) => toSelectableValue(gt, gt.name, false));
}
