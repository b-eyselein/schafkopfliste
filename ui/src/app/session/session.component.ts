import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreatableGame, Game, SessionWithPlayersAndRuleSet} from '../_interfaces/model';
import {Player} from '../_interfaces/player';
import {ApiService} from '../_services/api.service';
import {SelectableValue} from '../_interfaces/selectable-value';
import {GameType, getAllowedGameTypes, getSuitsForGameType, Suit, toCommitableGameType} from '../_interfaces/ruleset';

interface ActingPlayer extends Player {
  hasPut: boolean;
  gaveContra: boolean;
  hasWon: boolean;
}

function toActingPlayer(p: Player): ActingPlayer {
  return {...p, hasPut: false, gaveContra: false, hasWon: false};
}


@Component({templateUrl: './session.component.html'})
export class SessionComponent implements OnInit {

  session: SessionWithPlayersAndRuleSet;

  currentGameIndex = 1;

  actingPlayers: ActingPlayer[];
  allowedGameTypes: SelectableValue<GameType>[];
  allowedSuits: SelectableValue<Suit>[] = [];

  playedGames: Game[];

  player: ActingPlayer;
  playedGame: GameType | undefined;
  playedGameSuit: Suit;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId: number = parseInt(paramMap.get('groupId'), 10);
      const serialNumber: number = parseInt(paramMap.get('serialNumber'), 10);

      this.apiService.getSessionWithPlayersAndRuleSet(groupId, serialNumber)
        .subscribe((session) => {
          this.session = session;

          this.actingPlayers = [session.firstPlayer, session.secondPlayer, session.thirdPlayer, session.fourthPlayer].map(toActingPlayer);

          this.allowedGameTypes = getAllowedGameTypes(session.ruleSet);
        });
    });
  }

  isDealer(index: number): boolean {
    return (this.currentGameIndex - 1) % 4 === index;
  }

  togglePlayer(player: ActingPlayer): void {
    this.player = this.player === player ? undefined : player;
  }

  toggleGameType(gameType: GameType): void {
    this.playedGame = this.playedGame === gameType ? undefined : gameType;
    this.allowedSuits = this.playedGame ? getSuitsForGameType(this.playedGame) : [];
  }

  toggleSuit(suit: Suit): void {
    this.playedGameSuit = this.playedGameSuit === suit ? undefined : suit;
  }

  saveGame() {
    if (!this.playedGame) {
      alert('You have to select a game type!');
      return;
    }

    if (this.playedGame.needsSuit && !this.playedGameSuit) {
      alert('You have to select a suit!');
      console.info(this.playedGameSuit);
      return;
    }

    // TODO: laufende, schneider/schwarz!
    const game: CreatableGame = {
      gameType: toCommitableGameType(this.playedGame, this.playedGameSuit),
      laufendeCount: 0,
      schneiderSchwarz: undefined
    };

    console.warn('TODO: save game:\n' + JSON.stringify(game, null, 2));

    this.apiService.createGame(this.session.group.id, this.session.serialNumber, game)
      .subscribe((g) => this.playedGames.push(g));
  }

}
