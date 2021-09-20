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
import {CircleBufferSelectable} from '../../_components/circle-buffer/circle-buffer.component';
import {
  CreateGameGQL,
  GameInput,
  KontraType,
  SchneiderSchwarz,
  SessionFragment,
  SessionGameFragment,
  SessionPlayerFragment
} from '../../_services/apollo_services';

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

  readonly SchneiderSchwarzValues: { nickname: string, value: SchneiderSchwarz }[] = [
    {nickname: 'SN', value: SchneiderSchwarz.Schneider},
    {nickname: 'SW', value: SchneiderSchwarz.Schwarz}
  ];

  @Input() session: SessionFragment;

  @Input() groupName: string;
  @Input() sessionId: number;

  @Output() gameAdded = new EventEmitter<SessionGameFragment>();
  @Output() gameChanged = new EventEmitter<GameInput>();
  @Output() endSession = new EventEmitter<void>();

  players: SessionPlayerFragment[];
  bufferPlayers: CircleBufferSelectable<SessionPlayerFragment>[];

  game: GameInput;

  allowedGameTypes: CompleteGameType[] = [];
  allowedSuits: Suit[] = [];

  currentGameIndex = 1;

  isDoubled = false;

  remainingDoubledGames = 0;

  submitted = false;

  constructor(private createGameGQL: CreateGameGQL) {
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
        return {name: p.firstName + ' ' + p.lastName, value: p};
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
      actingPlayerNickname: undefined,
      gameType: undefined,
      suit: undefined,
      tout: false,

      isDoubled,
      laufendeCount: 0,
      schneiderSchwarz: undefined,

      playersHavingPutNicknames: [],
      kontra: undefined,
      playersHavingWonNicknames: [],
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
    return this.game.playersHavingPutNicknames;
  }

  set playersHavingPut(ids: string[]) {
    this.game.playersHavingPutNicknames = ids;
  }

  getDealer(): SessionPlayerFragment {
    return this.players[(this.currentGameIndex - 1) % 4];
  }

  togglePlayer(playerId: string): void {
    this.game.actingPlayerNickname = this.game.actingPlayerNickname === playerId ? undefined : playerId;

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
    if (this.game.playersHavingWonNicknames.includes(actingPlayer.nickname)) {
      this.game.playersHavingWonNicknames = this.game.playersHavingWonNicknames.filter((id) => id !== actingPlayer.nickname);
    } else {
      this.game.playersHavingWonNicknames.push(actingPlayer.nickname);
    }

    this.gameChanged.emit(this.game);
  }

  togglePlayerPut(player: SessionPlayerFragment): void {
    if (this.playersHavingPut.includes(player.nickname)) {
      this.playersHavingPut = this.playersHavingPut.filter((id) => id !== player.nickname);
    } else {
      this.game.playersHavingPutNicknames.push(player.nickname);
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
      !this.game.actingPlayerNickname
      || !this.playedGameType
      || (this.playedGameType.needsSuit && !this.game.suit)
      || this.game.playersHavingWonNicknames.length === 0
    ) {
      return;
    }

    this.createGameGQL
      .mutate({groupName: this.groupName, sessionId: this.sessionId, gameInput: this.game})
      .subscribe(
        ({data}) => {
          this.gameAdded.emit(data.newGame);
          this.resetData();
        },
        (error) => console.error(error)
      );
  }

  updateKontra(kontra: KontraType | undefined): void {
    this.game.kontra = kontra;
    this.gameChanged.emit(this.game);
  }

}
