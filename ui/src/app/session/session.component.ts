import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompleteSession, Game, playersForSession, SchneiderSchwarz} from '../_interfaces/model';
import {Player} from '../_interfaces/player';
import {ApiService} from '../_services/api.service';
import {SelectableValue} from '../_interfaces/selectable-value';
import {GameType, getAllowedGameTypes, getSuitsForGameType, Suit} from '../_interfaces/ruleset';

interface ActingPlayer extends Player {
  hasPut: boolean;
  gaveContra: boolean;
  hasWon: boolean;
}

@Component({templateUrl: './session.component.html'})
export class SessionComponent implements OnInit {

  readonly playerIndexes = [0, 1, 2, 3];

  session: CompleteSession;

  selectablePlayers: SelectableValue<Player>[];
  allowedGameTypes: SelectableValue<GameType>[];
  allowedSuits: SelectableValue<Suit>[];

  currentGameIndex = 1;

  actingPlayers: ActingPlayer[];

  player: ActingPlayer;
  playedGameType: GameType | undefined;
  playedGameSuit: Suit;
  tout = false;

  isDoubled = false;
  schneiderSchwarz: SchneiderSchwarz | undefined;
  laufendeCount = 0;

  doubledGames: number = 0;

  submitted = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId: number = parseInt(paramMap.get('groupId'), 10);
      const serialNumber: number = parseInt(paramMap.get('serialNumber'), 10);

      this.apiService.getCompleteSession(groupId, serialNumber)
        .subscribe((session) => {
          if (session) {
            this.session = session;

            this.actingPlayers = playersForSession(this.session).map((p) => {
              return {...p, hasPut: false, gaveContra: false, hasWon: false};
            });

            this.allowedGameTypes = getAllowedGameTypes(session.ruleSet);

            if (this.session.playedGames.length > 0) {
              this.currentGameIndex = Math.max(...this.session.playedGames.map((pg) => pg.id)) + 1;
            }
          }
        });
    });
  }

  private resetData(wasThrownIn: boolean = false): void {
    console.info('Resetting values...');

    if (!wasThrownIn) {
      this.currentGameIndex++;
    } else {
      this.doubledGames++;
    }

    if (this.doubledGames > 0) {
      this.isDoubled = true;
    }

    this.actingPlayers.forEach((p) => {
      p.hasPut = false;
      p.gaveContra = false;
      p.hasWon = false;
    });

    this.player = undefined;
    this.playedGameType = undefined;
    this.playedGameSuit = undefined;
    this.tout = false;

    this.schneiderSchwarz = undefined;
    this.laufendeCount = 0;

    this.submitted = false;
  }

  getDealer(): Player {
    return this.actingPlayers[(this.currentGameIndex - 1) % 4];
  }

  togglePlayer(p: ActingPlayer): void {
    this.player = this.player === p ? undefined : p;
  }

  onGameTypeUpdate(): void {
    this.allowedSuits = this.playedGameType ? getSuitsForGameType(this.playedGameType) : undefined;
  }

  toggleSuit(suit: Suit | undefined): void {
    this.playedGameSuit = this.playedGameSuit === suit ? undefined : suit;
  }

  toggleSchneiderSchwarz(snsw: SchneiderSchwarz | undefined): void {
    this.schneiderSchwarz = this.schneiderSchwarz === snsw ? undefined : snsw;
  }

  private getPlayersHavingPutIds(): number[] {
    return this.actingPlayers
      .filter((ap) => ap.hasPut)
      .map((ap) => ap.id);
  }

  private getPlayersWithContraIds(): number[] {
    return this.actingPlayers
      .filter((ap) => ap.gaveContra)
      .map((ap) => ap.id);
  }

  getPlayersHavingWonIds(): number[] {
    return this.actingPlayers
      .filter((ap) => ap.hasWon)
      .map((ap) => ap.id);
  }

  throwIn(): void {
    this.resetData(true);
  }

  saveGame() {
    this.submitted = true;

    if (!this.player || !this.playedGameType || (this.playedGameType.needsSuit && !this.playedGameSuit)) {
      return;
    }

    if (this.doubledGames) {
      this.doubledGames--;
    }

    const playersHavingWonIds = this.getPlayersHavingWonIds();

    if (playersHavingWonIds.length === 0) {
      alert('Mindestens ein Spieler muss gewonnen haben!');
      return;
    }

    // TODO: laufende!
    const game: Game = {
      id: this.currentGameIndex,
      sessionId: this.session.id,
      groupId: this.session.group.id,

      actingPlayerId: this.player.id,
      gameType: this.playedGameType.name,
      suit: this.playedGameSuit?.commitableSuit,

      isDoubled: this.isDoubled,
      laufendeCount: this.laufendeCount,
      schneiderSchwarz: this.schneiderSchwarz,

      playersHavingPut: {Right: this.getPlayersHavingPutIds()},
      playersWithContra: {Right: this.getPlayersWithContraIds()},
      playersHavingWonIds,
    };

    this.apiService.createGame(this.session.group.id, this.session.id, game)
      .subscribe((g) => {
        this.session.playedGames.push(g);
        this.resetData();
      });
  }

}
