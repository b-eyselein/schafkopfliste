export interface CreatableSession {
  date: string;
  firstPlayerId: number;
  secondPlayerId: number;
  thirdPlayerId: number;
  fourthPlayerId: number;
  ruleSetId: number;
}

export interface Session extends CreatableSession {
  uuid: string;
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
  return {value, isSelected};
}
