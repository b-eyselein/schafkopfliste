export interface Session {
  uuid: string;
  date: Date;
  players: Player[];
  allowedGameTypes: GameType[];
}

export interface Player {
  abbreviation: string;
  name: string;
}

export interface Game {
  gameType: GameType;
}


export interface GameType {
  name: string;
  playerPartySize: number;
  isDefaultGameType: boolean;
}

export const allGameTypes: GameType[] = [
  {name: 'Ruf', playerPartySize: 2, isDefaultGameType: true},
  {name: 'Wenz', playerPartySize: 1, isDefaultGameType: true},
  {name: 'Geier', playerPartySize: 1, isDefaultGameType: false},
  {name: 'Farbsolo', playerPartySize: 1, isDefaultGameType: true},
  {name: 'Bettel', playerPartySize: 1, isDefaultGameType: false},
  {name: 'Ramsch', playerPartySize: 1, isDefaultGameType: false},
  {name: 'Hochzeit', playerPartySize: 2, isDefaultGameType: false},
  {name: 'Farbwenz', playerPartySize: 1, isDefaultGameType: false}
];

export interface Selectable<T> {
  value: T;
  isSelected: boolean;
}
