export interface PlayerToCreate {
  abbreviation: string;
  name: string;
}

export interface Player extends PlayerToCreate {
  id: number;
}
