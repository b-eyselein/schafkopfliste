import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CompleteSession, Game, Player} from '../_interfaces/interfaces';
import {SessionResult} from '../_interfaces/session-result';
import {SUITS} from '../_interfaces/game_types';

@Component({
  selector: 'skl-games-table',
  templateUrl: './games-table.component.html'
})
export class GamesTableComponent implements OnInit, OnChanges {

  @Input() session: CompleteSession;

  @Input() runningGame: Game | undefined;

  players: Player[];

  currentActingPlayer: Player | undefined;

  sessionResults: Map<number, SessionResult>;

  ngOnInit(): void {
    this.players = [
      this.session.firstPlayer,
      this.session.secondPlayer,
      this.session.thirdPlayer,
      this.session.fourthPlayer
    ];

    this.updateSaldos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.runningGame && this.runningGame.actingPlayerId) {
      this.currentActingPlayer = this.players.find((p) => p.id === this.runningGame.actingPlayerId);
    }

    this.updateSaldos();
  }

  private updateSaldos(): void {
    if (this.players) {
      this.sessionResults = new Map(
        this.players.map((p) => {
          let saldo = 0;
          let wonGames = 0;
          let playedGames = 0;
          let putCount = 0;

          this.session.playedGames.forEach((game) => {
            const hasWon = game.game.playersHavingWonIds.includes(p.id);
            const isPlayer = game.game.actingPlayerId === p.id;
            const priceIsTripled = game.game.gameType !== 'Ruf' && isPlayer;

            saldo += (hasWon ? 1 : -1) * (priceIsTripled ? 3 : 1) * game.price;

            if (hasWon) {
              wonGames++;
            }
            if (isPlayer) {
              playedGames++;
            }
            if (game.game.playersHavingPutIds.includes(p.id)) {
              putCount++;
            }
          });

          return [p.id, {saldo, wonGames, playedGames, putCount}];
        })
      );
    }
  }

  getDealer(playedGame: Game): Player {
    return this.players[(playedGame.id - 1) % 4];
  }

  getSuitGermanName(playedGame: Game): string {
    return playedGame.suit ? SUITS.find((s) => s.commitableSuit === playedGame.suit).name : '';
  }

  getActingPlayer(playedGame: Game): Player {
    return this.players.find((p) => p.id === playedGame.actingPlayerId);
  }

  playersHavingPut(playedGame: Game): Player[] {
    return this.players.filter((p) => playedGame.playersHavingPutIds.includes(p.id));
  }

  playersHavingWon(playedGame: Game): Player[] {
    return this.players.filter((p) => playedGame.playersHavingWonIds.includes(p.id));
  }

}
