export interface Credentials {
  username: string;
  password: string;
}

export interface Player {
  username: string;
  abbreviation: string;
  name: string;
}

/*
export interface PlayerPosition {
  id: string;
  name: string;
}

export const dealer: PlayerPosition = {id: 'dealer', name: 'Geber'};
export const preHand: PlayerPosition = {id: 'preHand', name: 'Vorhand'};
export const middleHand: PlayerPosition = {id: 'middleHand', name: 'Mittelhand'};
export const rearHand: PlayerPosition = {id: 'rearHand', name: 'Rückhand'};

export const playerPositions: PlayerPosition[] = [
  dealer, preHand, middleHand, rearHand
];
 */

export interface CreatableSession {
  date: string;
  firstPlayerUsername: string;
  secondPlayerUsername: string;
  thirdPlayerUsername: string;
  fourthPlayerUsername: string;
  allowedGameTypeIds: number[];
}

export interface Session extends CreatableSession {
  uuid: string;
}

function getPlayerUsernamesFromSession(session: Session): string[] {
  return [
    session.firstPlayerUsername, session.secondPlayerUsername,
    session.thirdPlayerUsername, session.fourthPlayerUsername
  ];
}

export interface Game {
  gameType: GameType;
}

export interface GameType {
  id: number;
  name: string;
  playerPartySize: number;
  isDefaultGameType: boolean;
}

export interface Selectable<T> {
  value: T;
  isSelected: boolean;
}

export function toSelectable<T>(value: T, isSelected: boolean = false): Selectable<T> {
  return {value, isSelected}
}
