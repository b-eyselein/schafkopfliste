import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SessionResult} from '../_interfaces/session-result';
import {SUITS} from '../_interfaces/game_types';
import {
  BavarianSuit,
  GameInput,
  GameType,
  SessionGameFragment,
  SessionPlayerFragment
} from '../_services/apollo_services';

@Component({
  selector: 'skl-games-table',
  templateUrl: './games-table.component.html'
})
export class GamesTableComponent implements OnInit, OnChanges {


  @Input() players: SessionPlayerFragment[];
  @Input() games: SessionGameFragment[];

  @Input() runningGame: GameInput | undefined;

  currentActingPlayer: SessionPlayerFragment | undefined;

  sessionResults: Map<string, SessionResult>;

  ngOnInit(): void {
    this.updateSaldos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.runningGame && this.runningGame.actingPlayerNickname) {
      this.currentActingPlayer = this.players.find((p) => p.nickname === this.runningGame.actingPlayerNickname);
    }

    this.updateSaldos();
  }

  private updateSaldos(): void {
    this.sessionResults = new Map(
      this.players.map((p) => {
        let saldo = 0;
        let wonGames = 0;
        let playedGames = 0;
        let putCount = 0;

        this.games.forEach((game) => {
          const hasWon = game.playersHavingWonNicknames.includes(p.nickname);
          const isPlayer = game.actingPlayerNickname === p.nickname;
          const priceIsTripled = game.gameType !== GameType.Ruf && isPlayer;

          saldo += (hasWon ? 1 : -1) * (priceIsTripled ? 3 : 1) * game.price;

          if (hasWon) {
            wonGames++;
          }
          if (isPlayer) {
            playedGames++;
          }
          if (game.playersHavingPutNicknames.includes(p.nickname)) {
            putCount++;
          }
        });

        return [p.nickname, {saldo, wonGames, playedGames, putCount}];
      })
    );
  }

  nextGameId(): number {
    return this.games.length === 0 ? 1 : Math.max(...this.games.map(({id}) => id));
  }

  getDealer(gameId: number): SessionPlayerFragment {
    return this.players[(gameId - 1) % 4];
  }

  getSuitGermanName(suit: BavarianSuit | undefined): string {
    return suit ? SUITS.find((s) => s.commitableSuit === suit).name : '';
  }

  getActingPlayer(playedGame: SessionGameFragment): SessionPlayerFragment {
    return this.players.find((p) => p.nickname === playedGame.actingPlayerNickname);
  }

  playersHavingPut(playersHavingPutNicknames: string[]): SessionPlayerFragment[] {
    return this.players.filter((p) => playersHavingPutNicknames.includes(p.nickname));
  }

  playersHavingWon(playersHavingWonNicknames: string[]): SessionPlayerFragment[] {
    return this.players.filter((p) => playersHavingWonNicknames.includes(p.nickname));
  }

}
