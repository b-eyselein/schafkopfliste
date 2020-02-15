import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompleteSession, Game, SchneiderSchwarz} from '../_interfaces/model';
import {Player} from '../_interfaces/player';
import {ApiService} from '../_services/api.service';
import {SelectableValue, toSelectableValue} from '../_interfaces/selectable-value';
import {GameType, getAllowedGameTypes, getSuitsForGameType, Suit, SUITS} from '../_interfaces/ruleset';

interface ActingPlayer extends Player {
  hasPut: boolean;
  gaveContra: boolean;
  hasWon: boolean;
}

function toActingPlayer(p: Player): ActingPlayer {
  return {...p, hasPut: false, gaveContra: false, hasWon: false};
}

@Component({templateUrl: './session.component.html'})
export class SessionComponent implements OnInit {

  readonly schneiderSchwarzValues: SelectableValue<SchneiderSchwarz | undefined>[] = [
    ...['Schneider', 'Schwarz'].map((snsw: SchneiderSchwarz) => toSelectableValue<SchneiderSchwarz>(snsw, snsw, false))
  ];

  session: CompleteSession;

  allowedGameTypes: SelectableValue<GameType>[];
  allowedSuits: SelectableValue<Suit>[] = SUITS.map((rs) => toSelectableValue(rs, rs.name, false, undefined, true));

  currentGameIndex = 1;

  actingPlayers: ActingPlayer[];

  player: ActingPlayer;
  playedGameType: GameType | undefined;
  playedGameSuit: Suit;

  isDoubled = false;
  schneiderSchwarz: SchneiderSchwarz | undefined;
  tout = false;

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
            this.actingPlayers = this.getActingPlayers();
            this.allowedGameTypes = getAllowedGameTypes(session.ruleSet);

            if (this.session.playedGames.length > 0) {
              this.currentGameIndex = Math.max(...this.session.playedGames.map((pg) => pg.id)) + 1;
            }
          }
        });
    });
  }

  private getActingPlayers(): ActingPlayer[] {
    return [this.session.firstPlayer, this.session.secondPlayer, this.session.thirdPlayer, this.session.fourthPlayer].map(toActingPlayer);
  }

  private resetDataAfterRecording(): void {
    console.info('Resetting values...');

    this.currentGameIndex++;

    this.actingPlayers = this.getActingPlayers();

    this.player = undefined;
    this.playedGameType = undefined;
    this.playedGameSuit = undefined;

    this.isDoubled = false;
    this.tout = false;

  }

  isDealer(index: number): boolean {
    return (this.currentGameIndex - 1) % 4 === index;
  }

  togglePlayer(player: ActingPlayer): void {
    this.player = this.player === player ? undefined : player;
  }

  toggleGameType(gameType: GameType | undefined): void {
    if (gameType) {
      this.playedGameType = this.playedGameType === gameType ? undefined : gameType;
      this.allowedSuits = this.playedGameType ? getSuitsForGameType(this.playedGameType) : [];
    } else {

    }
  }

  toggleSuit(suit: Suit | undefined): void {
    this.playedGameSuit = this.playedGameSuit === suit ? undefined : suit;
  }

  toggleSchneiderSchwarz(schneiderSchwarz: SchneiderSchwarz | undefined): void {
    this.schneiderSchwarz = schneiderSchwarz;
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

  private getPlayersHavingWonIds(): number[] {
    return this.actingPlayers
      .filter((ap) => ap.hasWon)
      .map((ap) => ap.id);
  }

  saveGame() {
    if (!this.player) {
      alert('You have to select a player!');
      return;
    }

    if (!this.playedGameType) {
      alert('You have to select a game type!');
      return;
    }

    if (this.playedGameType.needsSuit && !this.playedGameSuit) {
      alert('You have to select a suit!');
      console.info(this.playedGameSuit);
      return;
    }

    const playersHavingWonIds = this.getPlayersHavingWonIds();

    if (playersHavingWonIds.length === 0) {
      alert('Mindestens ein Spieler muss gewonnen haben!');
      return;
    }

    // TODO: laufende, schneider/schwarz!
    const game: Game = {
      id: this.currentGameIndex,
      sessionId: this.session.id,
      groupId: this.session.group.id,

      actingPlayerId: this.player.id,
      gameType: this.playedGameType.name,
      suit: this.playedGameSuit.commitableSuit,

      isDoubled: this.isDoubled,
      laufendeCount: 0,
      schneiderSchwarz: this.schneiderSchwarz,

      playersHavingPutIds: this.getPlayersHavingPutIds(),
      playersWithContraIds: this.getPlayersWithContraIds(),
      playersHavingWonIds,
    };

    this.apiService.createGame(this.session.group.id, this.session.id, game)
      .subscribe((g) => {
        this.session.playedGames.push(g);
        this.resetDataAfterRecording();
      });
  }

}
