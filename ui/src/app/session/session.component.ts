import {Component, OnInit} from '@angular/core';
import {DexieService} from '../_services/dexie.service';
import {ActivatedRoute} from '@angular/router';
import {GameType, Player, Session} from '../_interfaces/model';

interface ActingPlayer extends Player {
  hasPut: boolean;
  wantsToPlay: boolean;
  gaveContra: boolean;
  hasWon: boolean;
}

@Component({templateUrl: './session.component.html'})
export class SessionComponent implements OnInit {

  session: Session;

  currentGameIndex = 1;

  actingPlayers: ActingPlayer[];

  player: ActingPlayer;
  playedGame: GameType;

  constructor(private route: ActivatedRoute, private dexieService: DexieService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const sessionUuid: string = paramMap.get('sessionUuid');

      this.dexieService.sessions.get(sessionUuid)
        .then((session) => {
          this.session = session;
          /*
          this.actingPlayers = this.session.players.map((p) => {
            return {
              ...p, hasPut: false, wantsToPlay: false, gaveContra: false, hasWon: false
            };
          });
           */
        });
    });
  }

  isDealer(index: number): boolean {
    return (this.currentGameIndex - 1) % 4 === index;
  }

}
