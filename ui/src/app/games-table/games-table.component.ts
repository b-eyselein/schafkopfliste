import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SessionResult} from '../_interfaces/session-result';
import {SUITS} from '../_interfaces/game_types';
import {GameType, SessionFragment, SessionGameFragment, SessionPlayerFragment} from '../_services/apollo_services';

@Component({
  selector: 'skl-games-table',
  templateUrl: './games-table.component.html'
})
export class GamesTableComponent implements OnInit, OnChanges {

  @Input() session: SessionFragment;

  @Input() runningGame: SessionGameFragment | undefined;

  players: SessionPlayerFragment[];

  currentActingPlayer: SessionPlayerFragment | undefined;

  sessionResults: Map<string, SessionResult>;

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
    if (this.runningGame && this.runningGame.actingPlayerAbbreviation) {
      this.currentActingPlayer = this.players.find((p) => p.abbreviation === this.runningGame.actingPlayerAbbreviation);
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

          this.session.games.forEach((game) => {
            const hasWon = game.playersHavingWonAbbreviations.includes(p.abbreviation);
            const isPlayer = game.actingPlayerAbbreviation === p.abbreviation;
            const priceIsTripled = game.gameType !== GameType.Ruf && isPlayer;

            saldo += (hasWon ? 1 : -1) * (priceIsTripled ? 3 : 1) * game.price;

            if (hasWon) {
              wonGames++;
            }
            if (isPlayer) {
              playedGames++;
            }
            if (game.playersHavingPutAbbreviations.includes(p.abbreviation)) {
              putCount++;
            }
          });

          return [p.abbreviation, {saldo, wonGames, playedGames, putCount}];
        })
      );
    }
  }

  getDealer(playedGame: SessionGameFragment): SessionPlayerFragment {
    return this.players[(playedGame.id - 1) % 4];
  }

  getSuitGermanName(playedGame: SessionGameFragment): string {
    return playedGame.suit ? SUITS.find((s) => s.commitableSuit === playedGame.suit).name : '';
  }

  getActingPlayer(playedGame: SessionGameFragment): SessionPlayerFragment {
    return this.players.find((p) => p.abbreviation === playedGame.actingPlayerAbbreviation);
  }

  playersHavingPut(playedGame: SessionGameFragment): SessionPlayerFragment[] {
    return this.players.filter((p) => playedGame.playersHavingPutAbbreviations.includes(p.abbreviation));
  }

  playersHavingWon(playedGame: SessionGameFragment): SessionPlayerFragment[] {
    return this.players.filter((p) => playedGame.playersHavingWonAbbreviations.includes(p.abbreviation));
  }

}
