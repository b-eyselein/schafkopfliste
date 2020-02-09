export interface CreatableGroup {
  name: string;
}

export interface Group extends CreatableGroup {
  id: number;
}

export interface GroupWithPlayerCount extends Group {
  playerCount?: number;
}
