import {BavarianSuitName, Game, GameTypeName, SchneiderSchwarz} from '../_interfaces/model';
import {CellObject, WorkSheet} from 'xlsx';
import {Player} from '../_interfaces/player';

export const header: string[] = [
  'id', // A
  'dealerAbbreviation',
  'isDoubled',
  'firstPlayerPut',
  'secondPlayerPut',
  'thirdPlayerPut', // F
  'fourthPlayerPut',
  'gameType',
  'suit',
  'playerAbbreviation',
  'contraCount', // K
  'firstPlayerWon',
  'secondPlayerWon',
  'thirdPlayerWon',
  'fourthPlayerWon',
  'schneiderSchwarz', // P
  'laufendeCount',
  'price',
  'firstPlayerRunningTotal',
  'secondPlayerRunningTotal',
  'thirdPlayerRunningTotal', // U
  'fourthPlayerRunningTotal'
];

type SpreadSheetSchneiderSchwarz = 'SN' | 'SW' | undefined;

export interface GameRow {
  id: number; // A
  dealerAbbreviation: string;
  isDoubled: boolean;
  firstPlayerPut: boolean;
  secondPlayerPut: boolean;
  thirdPlayerPut: boolean; // F
  fourthPlayerPut: boolean;
  gameType: GameTypeName;
  suit: BavarianSuitName | undefined;
  playerAbbreviation: string;
  contraCount: number; // K
  firstPlayerWon: boolean;
  secondPlayerWon: boolean;
  thirdPlayerWon: boolean;
  fourthPlayerWon: boolean
  schneiderSchwarz: SpreadSheetSchneiderSchwarz; // P
  laufendeCount: number;
  price: number;
  firstPlayerRunningTotal: number;
  secondPlayerRunningTotal: number;
  thirdPlayerRunningTotal: number; // U
  fourthPlayerRunningTotal: number
}

function readSchneiderSchwarz(snsw: SpreadSheetSchneiderSchwarz): SchneiderSchwarz | undefined {
  switch (snsw) {
    case 'SN':
      return 'Schneider';
    case 'SW':
      return 'Schwarz';
    default:
      return undefined;
  }
}

export function readSessionDateAndPlayers(groupMembers: Player[], ws: WorkSheet): { date: Date | undefined, players: Player[] } {
  const dateCell: CellObject = ws['D1'];
  const date = dateCell ? dateCell.v as Date : undefined;

  const firstPlayerAbbreviation: string = ws['F4'].v;
  const firstPlayer = groupMembers.find((p) => p.abbreviation === firstPlayerAbbreviation);

  const secondPlayerAbbreviation: string = ws['E5'].v;
  const secondPlayer = groupMembers.find((p) => p.abbreviation === secondPlayerAbbreviation);

  const thirdPlayerAbbreviation: string = ws['E6'].v;
  const thirdPlayer = groupMembers.find((p) => p.abbreviation === thirdPlayerAbbreviation);

  const fourthPlayerAbbreviation: string = ws['E7'].v;
  const fourthPlayer = groupMembers.find((p) => p.abbreviation === fourthPlayerAbbreviation);

  return {date, players: [firstPlayer, secondPlayer, thirdPlayer, fourthPlayer]};
}

export function readGameFromGameRow(groupId: number, sessionId: number, gameRow: GameRow): Game {
  return {
    id: gameRow.id,
    sessionId,
    groupId,

    actingPlayerId: -1,
    gameType: gameRow.gameType,
    suit: gameRow.suit,

    isDoubled: gameRow.isDoubled,
    laufendeCount: gameRow.laufendeCount,
    schneiderSchwarz: readSchneiderSchwarz(gameRow.schneiderSchwarz),

    playersHavingPut: {Left: -1},
    kontra: undefined,
    playersHavingWonIds: []
  };
}
