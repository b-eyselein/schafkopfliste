export type KontraType = 'Kontra' | 'Re' | 'Supra' | 'Resupra';
export const KontraTypeValues: KontraType[] = ['Kontra', 'Re', 'Supra', 'Resupra'];

export type BavarianSuitName = 'Acorns' | 'Leaves' | 'Hearts' | 'Bells';

export type GameTypeName = 'Ruf'
  | 'Wenz'
  | 'Farbsolo'
  | 'Geier'
  | 'Ramsch'
  | 'Bettel'
  | 'Hochzeit'
  | 'Farbwenz'
  | 'Farbgeier';

export type SchneiderSchwarz = 'Schneider' | 'Schwarz';
export const SchneiderSchwarzValues: SchneiderSchwarz[] = ['Schneider', 'Schwarz'];

export interface Game {
  id: number;
  sessionId: number;
  groupId: number;

  actingPlayerId: number;
  gameType: GameTypeName;
  suit: BavarianSuitName | undefined;
  tout: boolean;

  isDoubled: boolean;
  laufendeCount: number;
  schneiderSchwarz: SchneiderSchwarz | undefined;

  playersHavingPutIds: number[];
  kontra: KontraType | undefined;
  playersHavingWonIds: number[];
  price: number;
}
