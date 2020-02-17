import {Component, Input, OnInit} from '@angular/core';
import {CompleteSession, Game, isLeft} from '../../_interfaces/model';
import {Player} from '../../_interfaces/player';
import {SUITS} from '../../_interfaces/ruleset';

@Component({
  selector: 'skl-games-table',
  templateUrl: './games-table.component.html'
})
export class GamesTableComponent implements OnInit {

  @Input() session: CompleteSession;

  constructor() {
  }

  ngOnInit(): void {
  }

  get players(): Player[] {
    return [this.session.firstPlayer, this.session.secondPlayer, this.session.thirdPlayer, this.session.fourthPlayer];
  }

  getDealer(playedGame: Game): Player {
    return this.players[(playedGame.id - 1) % 4];
  }

  playersHavingPut(playedGame: Game): number | string {
    const php = playedGame.playersHavingPut;

    if (isLeft(php)) {
      return php.Left;
    } else {
      return this.players
        .filter((p) => php.Right.includes(p.id))
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

  playersWithContra(playedGame: Game): number | string {
    const pwc = playedGame.playersWithContra;

    if (isLeft(pwc)) {
      return pwc.Left;
    } else {
      return this.players
        .filter((p) => pwc.Right.includes(p.id))
        .map((p) => p.abbreviation)
        .join(', ');
    }
  }

  playersHavingWon(playedGame: Game): string {
    return this.players
      .filter((p) => playedGame.playersHavingWonIds.includes(p.id))
      .map((p) => p.abbreviation)
      .join(', ');
  }

}
