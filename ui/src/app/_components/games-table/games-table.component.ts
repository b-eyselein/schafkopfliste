import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CompleteSession, Game, Player} from '../../_interfaces/interfaces';
import {SUITS} from '../../_interfaces/ruleset';

@Component({
  selector: 'skl-games-table',
  templateUrl: './games-table.component.html'
})
export class GamesTableComponent implements OnInit, OnChanges {

  @Input() session: CompleteSession;

  @Input() runningGame: Game | undefined;

  players: Player[];

  currentActingPlayer: Player | undefined;

  private saldosForPlayers: Map<number, number>;

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
      this.saldosForPlayers = new Map(
        this.players.map((p) => {
          const saldo = this.session.playedGames.map((game) => {
            const priceIsTripled = game.game.gameType !== 'Ruf' && game.game.actingPlayerId === p.id;

            if (game.game.playersHavingWonIds.includes(p.id)) {
              return (priceIsTripled ? 3 : 1) * game.price;
            } else {
              return (priceIsTripled ? -3 : -1) * game.price;
            }
          }).reduce((x, y) => x + y, 0);


          return [p.id, saldo];
        })
      );
    }
  }

  getSaldoForPlayer(playerId: number): number | undefined {
    return this.saldosForPlayers.get(playerId);
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
