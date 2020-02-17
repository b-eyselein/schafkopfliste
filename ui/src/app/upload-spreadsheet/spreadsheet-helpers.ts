import {BavarianSuitName, Game, GameTypeName, SchneiderSchwarz, Session} from '../_interfaces/model';
import {CellObject, WorkSheet} from 'xlsx';
import {Group} from '../_interfaces/group';

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

export function readSession(group: Group, ws: WorkSheet): Session {
  const dateCell: CellObject = ws['D1'];
  console.info(dateCell.t);
  const date: string = dateCell ? dateCell.v as string : 'TODO!';

  return {
    id: -1,
    groupId: group.id,
    date,
    ruleSetId: group.default_rule_set_id,
    firstPlayerId: -1,
    secondPlayerId: -1,
    thirdPlayerId: -1,
    fourthPlayerId: -1,
  };
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
    playersWithContra: {Left: -1},
    playersHavingWonIds: []
  };
}
