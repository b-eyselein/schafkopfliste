import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CompleteSession} from '../../_interfaces/model';
import {SUITS} from '../../_interfaces/ruleset';
import {Game} from '../../_interfaces/game';
import {Player} from '../../_interfaces/interfaces';

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
    this.currentActingPlayer = this.runningGame?.actingPlayerId ?
      this.players.find((p) => p.id = this.runningGame.actingPlayerId) : undefined;
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
    return this.players.filter((p) => playedGame.playersHavingWonIds.includes(p.id))
  }

}
