import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GameType, CreatableSession, Player, Selectable, toSelectable} from '../_interfaces/model';
import {ApiService} from "../_services/api.service";

@Component({templateUrl: './index.component.html'})
export class IndexComponent implements OnInit {

  gameTypes: Selectable<GameType>[];

  players: Player[];

  firstDealer: Player = null;
  firstPreHand: Player = null;
  firstMiddleHand: Player = null;
  firstRearHand: Player = null;

  constructor(private apiService: ApiService, private router: Router) {
  }

  ngOnInit() {
    this.apiService.getGameTypes()
      .subscribe((gameTypes) =>
        this.gameTypes = gameTypes.map((gt) => toSelectable(gt, gt.isDefaultGameType))
      );

    this.apiService.getPlayers()
      .subscribe((players) => this.players = players);
  }

  createSession(): void {
    const allowedGameTypes: GameType[] = this.gameTypes
      .filter((sgt) => sgt.isSelected)
      .map((sgt) => sgt.value);

    if (allowedGameTypes.length < 1) {
      alert('Please select at least one game type!');
      return;
    }

    if (!this.firstDealer || !this.firstPreHand || !this.firstMiddleHand || !this.firstRearHand) {
      alert('Please select players for every position!');
      return;
    }

    const today: Date = new Date();

    const session: CreatableSession = {
      date: `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`,
      firstPlayerUsername: this.firstDealer.username,
      secondPlayerUsername: this.firstPreHand.username,
      thirdPlayerUsername: this.firstMiddleHand.username,
      fourthPlayerUsername: this.firstRearHand.username,
      allowedGameTypeIds: allowedGameTypes.map((gt) => gt.id)
    };

    this.apiService.createSession(session)
      .subscribe((response) => {
        console.info(response);
      });

    /*
    this.dexieService.sessions.get(session.uuid)
      .then((maybeSession) => {
        if (maybeSession) {
          alert('Session with generated UUID ' + session.uuid + ' already exists, try again!');
          return;
        }

        this.dexieService.sessions.put(session)
          .then((sessionUuid) => this.router.navigate(['sessions', sessionUuid]));
      });
     */

  }

}
