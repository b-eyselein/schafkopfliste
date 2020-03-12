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
import {CompleteSession, Game, KontraType, Player, SchneiderSchwarz} from '../../_interfaces/interfaces';
import {ApiService} from '../../_services/api.service';
import {CircleBufferSelectable} from '../../_components/circle-buffer/circle-buffer.component';

@Component({
  selector: 'skl-new-game',
  templateUrl: './new-game.component.html'
})
export class NewGameComponent implements OnInit {

  readonly KontraValues: CircleBufferSelectable<KontraType>[] = [
    {name: '--', value: undefined},
    {name: 'Kontra', value: 'Kontra'},
    {name: 'Re', value: 'Re'},
    {name: 'Supra', value: 'Supra'},
    {name: 'Resupra', value: 'Resupra'}
  ];

  readonly SuitValues: Suit[] = SUITS;

  readonly SchneiderSchwarzValues: { abbreviation: string, value: SchneiderSchwarz }[] = [
    {abbreviation: 'SN', value: 'Schneider'},
    {abbreviation: 'SW', value: 'Schwarz'}
  ];

  @Input() session: CompleteSession;

  @Output() gameChanged = new EventEmitter<Game>();
  @Output() endSession = new EventEmitter<void>();

  players: Player[];
  bufferPlayers: CircleBufferSelectable<Player>[];

  game: Game;

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
      {name: '--', value: undefined} as CircleBufferSelectable<Player>,
      ...this.players.map((p) => {
        return {name: p.name, value: p};
      })
    ];

    this.allowedGameTypes = getAllowedGameTypes(this.session.ruleSet);

    if (this.session.playedGames.length > 0) {
      this.currentGameIndex = Math.max(...this.session.playedGames.map((pg) => pg.game.id)) + 1;
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
      sessionId: this.session.id,
      groupId: this.session.group.id,

      actingPlayerId: undefined,
      gameType: undefined,
      suit: undefined,
      tout: false,

      isDoubled,
      laufendeCount: 0,
      schneiderSchwarz: undefined,

      playersHavingPutIds: [],
      kontra: undefined,
      playersHavingWonIds: [],
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

  get playersHavingPut(): number[] {
    return this.game.playersHavingPutIds;
  }

  set playersHavingPut(ids: number[]) {
    this.game.playersHavingPutIds = ids;
  }

  getDealer(): Player {
    return this.players[(this.currentGameIndex - 1) % 4];
  }

  togglePlayer(playerId: number): void {
    this.game.actingPlayerId = this.game.actingPlayerId === playerId ? undefined : playerId;

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

  toggleWinningPlayer(actingPlayer: Player) {
    if (this.game.playersHavingWonIds.includes(actingPlayer.id)) {
      this.game.playersHavingWonIds = this.game.playersHavingWonIds.filter((id) => id !== actingPlayer.id);
    } else {
      this.game.playersHavingWonIds.push(actingPlayer.id);
    }

    this.gameChanged.emit(this.game);
  }

  togglePlayerPut(player: Player): void {
    if (this.playersHavingPut.includes(player.id)) {
      this.playersHavingPut = this.playersHavingPut.filter((id) => id !== player.id);
    } else {
      this.game.playersHavingPutIds.push(player.id);
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
      !this.game.actingPlayerId
      || !this.playedGameType
      || (this.playedGameType.needsSuit && !this.game.suit)
      || this.game.playersHavingWonIds.length === 0
    ) {
      return;
    }

    const theGame: Game = {
      id: this.currentGameIndex,
      sessionId: this.session.id,
      groupId: this.session.group.id,

      ...this.game,
    };

    this.apiService.createGame(this.session.group.id, this.session.id, theGame)
      .subscribe((g) => {
        this.session.playedGames.push(g);
        this.resetData();
      });
  }

  updateKontra(kontra: KontraType | undefined): void {
    this.game.kontra = kontra;
    this.gameChanged.emit(this.game);
  }

}
