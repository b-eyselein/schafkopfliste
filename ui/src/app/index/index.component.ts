import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {allGameTypes, GameType, Player, Selectable, Session} from '../_interfaces/model';
import {DexieService} from '../_services/dexie.service';
import {UUID} from 'angular2-uuid';
import {ApiService} from "../_services/api.service";


@Component({templateUrl: './index.component.html'})
export class IndexComponent implements OnInit {

  readonly playerPositions: string[] = [
    'Erster Geber', 'Erste Vorhand', 'Erste Mittelhand', 'Erste Rückhand'
  ];

  gameTypes: Selectable<GameType>[] = allGameTypes.map((gt) => {
    return {value: gt, isSelected: gt.isDefaultGameType};
  });

  players: Player[];

  chosenPlayers: Player[] = [null, null, null, null];

  constructor(private apiService: ApiService,private dexieService: DexieService, private router: Router) {
  }

  ngOnInit() {
    this.apiService.getPlayers()
      .subscribe((players) => this.players = players);
  }

  selectPlayer(index: number, player: Player): void {
    this.chosenPlayers[index] = player;
  }

  createSession(): void {
    const allowedGameTypes: GameType[] = this.gameTypes.filter((sgt) => sgt.isSelected).map((sgt) => sgt.value);

    if (allowedGameTypes.length < 1) {
      alert('Please select at least one game type!');
      return;
    }

    const session: Session = {
      uuid: UUID.UUID(),
      date: new Date(),
      players: [this.chosenPlayers[0], this.chosenPlayers[1], this.chosenPlayers[2], this.chosenPlayers[3]],
      allowedGameTypes
    };

    this.dexieService.sessions.get(session.uuid)
      .then((maybeSession) => {
        if (maybeSession) {
          alert('Session with generated UUID ' + session.uuid + ' already exists, try again!');
          return;
        }

        this.dexieService.sessions.put(session)
          .then((sessionUuid) => this.router.navigate(['sessions', sessionUuid]));
      });

  }

}
