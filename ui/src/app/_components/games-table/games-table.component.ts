import {Component, Input} from '@angular/core';
import {CompleteSession, Either, Game, isLeft} from '../../_interfaces/model';
import {Player} from '../../_interfaces/player';
import {SUITS} from '../../_interfaces/ruleset';

@Component({
  selector: 'skl-games-table',
  templateUrl: './games-table.component.html'
})
export class GamesTableComponent {

  @Input() session: CompleteSession;

  private get players(): Player[] {
    return [this.session.firstPlayer, this.session.secondPlayer, this.session.thirdPlayer, this.session.fourthPlayer];
  }

  getDealer(playedGame: Game): Player {
    return this.players[(playedGame.id - 1) % 4];
  }

  getPlayersFromEither(e: Either<number, number[]>): number | string {
    if (isLeft(e)) {
      return e.Left;
    } else {
      return this.players
        .filter((p) => e.Right.includes(p.id))
        .map((p) => p.abbreviation)
        .join(', ');
    }
  }

  getSuitGermanName(playedGame: Game): string {
    return playedGame.suit ? SUITS.find((s) => s.commitableSuit === playedGame.suit).name : '';
  }

  getActingPlayer(playedGame: Game): Player {
    return this.players.find((p) => p.id === playedGame.actingPlayerId);
  }

  playersHavingWon(playedGame: Game): string {
    return this.players
      .filter((p) => playedGame.playersHavingWonIds.includes(p.id))
      .map((p) => p.abbreviation)
      .join(', ');
  }

}
