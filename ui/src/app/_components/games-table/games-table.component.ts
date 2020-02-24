import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CompleteSession} from '../../_interfaces/model';
import {Player} from '../../_interfaces/player';
import {SUITS} from '../../_interfaces/ruleset';
import {Either, Game, isLeft} from '../../_interfaces/game';

@Component({
  selector: 'skl-games-table',
  templateUrl: './games-table.component.html'
})
export class GamesTableComponent implements OnChanges {

  @Input() session: CompleteSession;

  @Input() runningGame: Game | undefined;

  currentActingPlayer: Player | undefined;

  private get players(): Player[] {
    return [this.session.firstPlayer, this.session.secondPlayer, this.session.thirdPlayer, this.session.fourthPlayer];
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.info(this.runningGame?.actingPlayerId);

    this.currentActingPlayer = this.runningGame?.actingPlayerId ?
      this.players.find((p) => p.id = this.runningGame.actingPlayerId) : undefined;
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
