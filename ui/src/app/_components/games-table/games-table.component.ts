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

  ngOnInit(): void {
    this.players = [
      this.session.firstPlayer,
      this.session.secondPlayer,
      this.session.thirdPlayer,
      this.session.fourthPlayer
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.runningGame && this.runningGame.actingPlayerId) {
      this.currentActingPlayer = this.players.find((p) => p.id === this.runningGame.actingPlayerId);
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

  getSaldoForPlayer(playerId: number): number {
    return this.session.playedGames
      .map((game) => {
        if (game.game.playersHavingWonIds.includes(playerId)) {
          return game.price;
        } else {
          // TODO: triple solo...
          if (game.game.gameType === 'Ruf') {
            return -game.price;
          } else {
            return 3 * -game.price;
          }
        }
      })
      .reduce((x, y) => x + y, 0);
  }
}
