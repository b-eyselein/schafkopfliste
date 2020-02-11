import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GameType, SessionWithPlayersAndRuleSet} from '../_interfaces/model';
import {Player} from '../_interfaces/player';
import {ApiService} from '../_services/api.service';

interface ActingPlayer extends Player {
  hasPut: boolean;
  wantsToPlay: boolean;
  gaveContra: boolean;
  hasWon: boolean;
}

function toActingPlayer(p: Player): ActingPlayer {
  return {
    ...p, hasPut: false, wantsToPlay: false, gaveContra: false, hasWon: false
  };
}

@Component({templateUrl: './session.component.html'})
export class SessionComponent implements OnInit {

  session: SessionWithPlayersAndRuleSet;

  currentGameIndex = 1;

  actingPlayers: ActingPlayer[];

  player: ActingPlayer;
  playedGame: GameType;

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
        });
    });
  }

  isDealer(index: number): boolean {
    return (this.currentGameIndex - 1) % 4 === index;
  }

}
