import {Player} from './player';
import {RuleSet} from './ruleset';
import {Group} from './group';

export interface CreatableSession {
  ruleSetId: number;
  date: string;
  firstPlayerId: number;
  secondPlayerId: number;
  thirdPlayerId: number;
  fourthPlayerId: number;

}

export interface Session extends CreatableSession {
  serialNumber: number;
  groupId: number;
}

export interface SessionWithPlayersAndRuleSet {
  serialNumber: number;
  group: Group;
  firstPlayer: Player;
  secondPlayer: Player;
  thirdPlayer: Player;
  fourthPlayer: Player;
  ruleSet: RuleSet;
}

export type CommitableSuit = 'Acorns' | 'Leaves' | 'Hearts' | 'Bells';

export type CommitableGameTypeGameType = 'Ruf'
  | 'Wenz'
  | 'Farbsolo'
  | 'Geier'
  | 'Ramsch'
  | 'Bettel'
  | 'Hochzeit'
  | 'Farbwenz'
  | 'Farbgeier';

export type SchneiderSchwarz = 'Schneider' | 'Schwarz';

export type CommitableGameType = {
  type: CommitableGameTypeGameType;
  suit?: CommitableSuit;
};

export interface CreatableGame {
  gameType: CommitableGameType;
  laufendeCount: number;
  schneiderSchwarz: SchneiderSchwarz | undefined;
}

export interface Game extends CreatableGame {
  sessionSerialNumber: number;
  groupId: number;
  serialNumber: number;
}
