import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CompleteGameType,
  getAllowedGameTypes,
  getSuitsForGameType,
  HEARTS,
  RUF,
  Suit,
  SUITS
} from '../../_interfaces/game_types';
import {ApiService} from '../../_services/api.service';
import {CircleBufferSelectable} from '../../_components/circle-buffer/circle-buffer.component';
import {
  BavarianSuit,
  GameType,
  KontraType,
  SchneiderSchwarz,
  SessionFragment,
  SessionGameFragment,
  SessionPlayerFragment
} from '../../_services/apollo_services';


/**
 * @deprecated
 */
export interface Game {
  actingPlayerId: string;
  gameType: GameType;
  groupName: string;
  id: number;
  isDoubled: boolean;
  kontra: KontraType | undefined;
  laufendeCount: number;
  playersHavingPutIds: string[];
  playersHavingWonIds: string[];
  schneiderSchwarz: SchneiderSchwarz | undefined;
  sessionId: number;
  suit: BavarianSuit | undefined;
  tout: boolean;
}


@Component({
  selector: 'skl-new-game',
  templateUrl: './new-game.component.html'
})
export class NewGameComponent implements OnInit {

  readonly KontraValues: CircleBufferSelectable<KontraType>[] = [
    {name: '--', value: undefined},
    {name: 'Kontra', value: KontraType.Kontra},
    {name: 'Re', value: KontraType.Re},
    {name: 'Supra', value: KontraType.Supra},
    {name: 'Resupra', value: KontraType.Resupra}
  ];

  readonly SuitValues: Suit[] = SUITS;

  readonly SchneiderSchwarzValues: { abbreviation: string, value: SchneiderSchwarz }[] = [
    {abbreviation: 'SN', value: SchneiderSchwarz.Schneider},
    {abbreviation: 'SW', value: SchneiderSchwarz.Schwarz}
  ];

  @Input() session: SessionFragment;

  @Input() groupName: string;
  @Input() sessionId: number;

  @Output() gameChanged = new EventEmitter<SessionGameFragment>();
  @Output() endSession = new EventEmitter<void>();

  players: SessionPlayerFragment[];
  bufferPlayers: CircleBufferSelectable<SessionPlayerFragment>[];

  game: SessionGameFragment;

  allowedGameTypes: CompleteGameType[] = [];
  allowedSuits: Suit[] = [];

  currentGameIndex = 1;

  isDoubled = false;

  remainingDoubledGames = 0;

  submitted = false;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.players = [
      this.session.firstPlayer,
      this.session.secondPlayer,
      this.session.thirdPlayer,
      this.session.fourthPlayer
    ];

    this.bufferPlayers = [
      {name: '--', value: undefined} as CircleBufferSelectable<SessionPlayerFragment>,
      ...this.players.map((p) => {
        return {name: p.name, value: p};
      })
    ];

    this.allowedGameTypes = getAllowedGameTypes(this.session.ruleSet);

    if (this.session.games.length > 0) {
      this.currentGameIndex = Math.max(...this.session.games.map((pg) => pg.id)) + 1;
    }

    this.reInitGame();
  }

  get playedGameType(): CompleteGameType | undefined {
    if (this.game.gameType) {
      return this.allowedGameTypes.find((gt) => gt.name === this.game.gameType);
    } else {
      return undefined;
    }
  }

  private reInitGame(): void {
    let isDoubled = false;
    if (this.remainingDoubledGames > 0) {
      this.remainingDoubledGames--;
      isDoubled = true;
    }

    this.game = {
      id: this.currentGameIndex,
//      sessionId: this.sessionId,
      //     groupName: this.groupName,

      actingPlayerAbbreviation: undefined,
      gameType: undefined,
      suit: undefined,
      tout: false,

      isDoubled,
      laufendeCount: 0,
      schneiderSchwarz: undefined,

      playersHavingPutAbbreviations: [],
      kontra: undefined,
      playersHavingWonAbbreviations: [],

      price: -1
    };

  }

  private resetData(wasThrownIn: boolean = false): void {
    if (wasThrownIn) {
      this.remainingDoubledGames++;
    } else {
      this.currentGameIndex++;
    }

    if (this.remainingDoubledGames > 0) {
      this.isDoubled = true;
    }

    this.submitted = false;

    this.reInitGame();
  }

  suitCanBePlayedWithGameType(suit: Suit): boolean {
    const gameType = this.playedGameType;

    return gameType.needsSuit && (gameType === RUF ? suit !== HEARTS : true);
  }

  get playersHavingPut(): string[] {
    return this.game.playersHavingPutAbbreviations;
  }

  set playersHavingPut(ids: string[]) {
    this.game.playersHavingPutAbbreviations = ids;
  }

  getDealer(): SessionPlayerFragment {
    return this.players[(this.currentGameIndex - 1) % 4];
  }

  togglePlayer(playerId: string): void {
    this.game.actingPlayerAbbreviation = this.game.actingPlayerAbbreviation === playerId ? undefined : playerId;

    this.gameChanged.emit(this.game);
  }

  toggleGameType(gameType: CompleteGameType): void {
    this.game.gameType = this.game.gameType === gameType.name ? undefined : gameType.name;

    if (!gameType.needsSuit) {
      this.game.suit = undefined;
    }

    this.allowedSuits = this.playedGameType ? getSuitsForGameType(this.playedGameType) : undefined;

    this.gameChanged.emit(this.game);
  }

  toggleSuit(suit: Suit): void {
    this.game.suit = this.game.suit === suit.commitableSuit ? undefined : suit.commitableSuit;

    this.gameChanged.emit(this.game);
  }

  toggleSchneiderSchwarz(snsw: SchneiderSchwarz): void {
    this.game.schneiderSchwarz = this.game.schneiderSchwarz === snsw ? undefined : snsw;

    this.gameChanged.emit(this.game);
  }

  toggleKontraValue(kv: KontraType): void {
    this.game.kontra = this.game.kontra === kv ? undefined : kv;

    this.gameChanged.emit(this.game);
  }

  toggleWinningPlayer(actingPlayer: SessionPlayerFragment) {
    if (this.game.playersHavingWonAbbreviations.includes(actingPlayer.abbreviation)) {
      this.game.playersHavingWonAbbreviations = this.game.playersHavingWonAbbreviations.filter((id) => id !== actingPlayer.abbreviation);
    } else {
      this.game.playersHavingWonAbbreviations.push(actingPlayer.abbreviation);
    }

    this.gameChanged.emit(this.game);
  }

  togglePlayerPut(player: SessionPlayerFragment): void {
    if (this.playersHavingPut.includes(player.abbreviation)) {
      this.playersHavingPut = this.playersHavingPut.filter((id) => id !== player.abbreviation);
    } else {
      this.game.playersHavingPutAbbreviations.push(player.abbreviation);
    }

    this.gameChanged.emit(this.game);
  }

  throwIn(): void {
    this.resetData(true);

    this.gameChanged.emit(this.game);
  }

  saveGame() {
    this.submitted = true;

    if (
      !this.game.actingPlayerAbbreviation
      || !this.playedGameType
      || (this.playedGameType.needsSuit && !this.game.suit)
      || this.game.playersHavingWonAbbreviations.length === 0
    ) {
      return;
    }

    const theGame: SessionGameFragment = {
      id: this.currentGameIndex,
      // sessionId: this.sessionId,
      // groupName: this.groupName,

      ...this.game,
    };

    this.apiService.createGame(this.groupName, this.sessionId, theGame)
      .subscribe((g) => {
        // this.session.games.push(g);
        this.resetData();
      });
  }

  updateKontra(kontra: KontraType | undefined): void {
    this.game.kontra = kontra;
    this.gameChanged.emit(this.game);
  }

}
