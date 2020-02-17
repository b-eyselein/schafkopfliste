import {Component, Input, OnInit} from '@angular/core';
import {CompleteSession, Game} from '../../_interfaces/model';
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

  playerHasPut(playedGame: Game, player: Player): boolean {
    if (Array.isArray(playedGame.playersHavingPut)) {
      return playedGame.playersHavingPut.includes(player.id);
    } else {
      return false;
    }
  }

  getSuitGermanName(playedGame: Game): string {
    return playedGame.suit ? SUITS.find((s) => s.commitableSuit === playedGame.suit).name : '';
  }

  getActingPlayer(playedGame: Game): Player {
    return this.players.find((p) => p.id === playedGame.actingPlayerId);
  }

  playerGaveContra(playedGame: Game, p: Player) {
    if (Array.isArray(playedGame.playersWithContra)) {
      return playedGame.playersWithContra.includes(p.id);
    } else {
      return false;
    }
  }

  playerHasWon(playedGame: Game, p: Player): boolean {
    return playedGame.playersHavingWonIds.includes(p.id);
  }
}
