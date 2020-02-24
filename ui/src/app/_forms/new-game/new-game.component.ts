import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CompleteSession, playersForSession} from '../../_interfaces/model';
import {GameType, getAllowedGameTypes, getSuitsForGameType, HEARTS, RUF, Suit, SUITS} from '../../_interfaces/ruleset';
import {Player} from '../../_interfaces/player';
import {ApiService} from '../../_services/api.service';
import {Game, KontraType, KontraTypeValues, Right, SchneiderSchwarz} from '../../_interfaces/game';

@Component({
  selector: 'skl-new-game',
  templateUrl: './new-game.component.html'
})
export class NewGameComponent implements OnInit {

  readonly KontraValues: KontraType[] = KontraTypeValues;
  readonly SuitValues: Suit[] = SUITS;

  readonly SchneiderSchwarzValues: { abbreviation: string, value: SchneiderSchwarz }[] = [
    {abbreviation: 'SN', value: 'Schneider'},
    {abbreviation: 'SW', value: 'Schwarz'}
  ];

  @Input() session: CompleteSession;

  @Output() gameChanged = new EventEmitter<Game>();

  players: Player[];

  game: Game;

  allowedGameTypes: GameType[] = [];
  allowedSuits: Suit[] = [];

  currentGameIndex = 1;

  tout = false;

  isDoubled = false;

  remainingDoubledGames = 0;

  submitted = false;


  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.players = playersForSession(this.session);

    this.allowedGameTypes = getAllowedGameTypes(this.session.ruleSet);

    if (this.session.playedGames.length > 0) {
      this.currentGameIndex = Math.max(...this.session.playedGames.map((pg) => pg.id)) + 1;
    }

    this.reInitGame(1);
  }

  get playedGameType(): GameType | undefined {
    if (this.game.gameType) {
      return this.allowedGameTypes.find((gt) => gt.name === this.game.gameType);
    } else {
      return undefined;
    }
  }

  private reInitGame(id: number): void {
    this.game = {
      id: this.currentGameIndex,
      sessionId: this.session.id,
      groupId: this.session.group.id,

      actingPlayerId: undefined,
      gameType: undefined,
      suit: undefined,

      isDoubled: false,
      laufendeCount: 0,
      schneiderSchwarz: undefined,

      playersHavingPut: {Right: []},
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

    this.tout = false;

    this.submitted = false;
  }

  suitCanBePlayedWithGameType(suit: Suit): boolean {
    const gameType = this.playedGameType;

    return gameType.needsSuit && (gameType === RUF ? suit !== HEARTS : true);
  }

  get playersHavingPut(): number[] {
    return (this.game.playersHavingPut as Right<number, number[]>).Right;
  }

  set playersHavingPut(ids: number[]) {
    (this.game.playersHavingPut as Right<number, number[]>).Right = ids;
  }

  getDealer(): Player {
    return this.players[(this.currentGameIndex - 1) % 4];
  }

  togglePlayer(p: Player): void {
    this.game.actingPlayerId = this.game.actingPlayerId === p.id ? undefined : p.id;

    this.gameChanged.emit(this.game);
  }

  toggleGameType(gameType: GameType): void {
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
      (this.game.playersHavingPut as Right<number, number[]>).Right.push(player.id);
    }

    this.gameChanged.emit(this.game);
  }

  throwIn(): void {
    this.resetData(true);
  }

  saveGame() {
    this.submitted = true;

    if (!this.game.actingPlayerId || !this.playedGameType || (this.playedGameType.needsSuit && !this.game.suit)) {
      return;
    }

    if (this.remainingDoubledGames) {
      this.remainingDoubledGames--;
    }

    if (this.game.playersHavingWonIds.length === 0) {
      alert('Mindestens ein Spieler muss gewonnen haben!');
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


}
