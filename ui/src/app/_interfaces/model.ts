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
