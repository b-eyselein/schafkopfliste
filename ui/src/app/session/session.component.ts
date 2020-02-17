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

function getPlayersForSession(s: CompleteSession): Player[] {
  return [s.firstPlayer, s.secondPlayer, s.thirdPlayer, s.fourthPlayer];
}


function getSelectablePlayers(s: CompleteSession): SelectableValue<Player>[] {
  return getPlayersForSession(s).map((p) => toSelectableValue(p, p.name));
}

function getActingPlayers(s: CompleteSession): ActingPlayer[] {
  return getPlayersForSession(s).map(toActingPlayer);
}


@Component({templateUrl: './session.component.html'})
export class SessionComponent implements OnInit {

  readonly playerIndexes = [0, 1, 2, 3];

  readonly schneiderSchwarzValues: SelectableValue<SchneiderSchwarz | undefined>[] = [
    ...['Schneider', 'Schwarz'].map((snsw: SchneiderSchwarz) => toSelectableValue<SchneiderSchwarz>(snsw, snsw))
  ];

  session: CompleteSession;

  selectablePlayers: SelectableValue<Player>[];
  allowedGameTypes: SelectableValue<GameType>[];
  allowedSuits: SelectableValue<Suit>[] = SUITS.map((rs) => toSelectableValue(rs, rs.name));

  currentGameIndex = 1;

  actingPlayers: ActingPlayer[];

  player: ActingPlayer;
  playedGameType: GameType | undefined;
  playedGameSuit: Suit;

  isDoubled = false;
  schneiderSchwarz: SchneiderSchwarz | undefined;
  tout = false;

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
            this.actingPlayers = getActingPlayers(this.session);
            this.selectablePlayers = getSelectablePlayers(this.session);
            this.allowedGameTypes = getAllowedGameTypes(session.ruleSet);

            if (this.session.playedGames.length > 0) {
              this.currentGameIndex = Math.max(...this.session.playedGames.map((pg) => pg.id)) + 1;
            }
          }
        });
    });
  }

  private resetDataAfterRecording(): void {
    console.info('Resetting values...');

    this.currentGameIndex++;

    this.actingPlayers = getActingPlayers(this.session);

    this.player = undefined;
    this.playedGameType = undefined;
    this.playedGameSuit = undefined;

    this.isDoubled = false;
    this.tout = false;

    this.submitted = false;
  }

  isDealer(index: number): boolean {
    return (this.currentGameIndex - 1) % 4 === index;
  }

  togglePlayer(p: ActingPlayer): void {
    this.player = this.player === p ? undefined : p;
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

  private getPlayersHavingWonIds(): number[] {
    return this.actingPlayers
      .filter((ap) => ap.hasWon)
      .map((ap) => ap.id);
  }

  saveGame() {
    this.submitted = true;

    if (!this.player || !this.playedGameType) {
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

      playersHavingPut: {Right: this.getPlayersHavingPutIds()},
      playersWithContra: {Right: this.getPlayersWithContraIds()},
      playersHavingWonIds,
    };

    this.apiService.createGame(this.session.group.id, this.session.id, game)
      .subscribe((g) => {
        this.session.playedGames.push(g);
        this.resetDataAfterRecording();
      });
  }

}
