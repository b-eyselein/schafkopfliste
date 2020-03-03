import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompleteSession, Game} from '../_interfaces/interfaces';
import {ApiService} from '../_services/api.service';

@Component({templateUrl: './session.component.html'})
export class SessionComponent implements OnInit {

  readonly playerIndexes = [0, 1, 2, 3];

  session: CompleteSession;

  game: Game;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId: number = parseInt(paramMap.get('groupId'), 10);
      const serialNumber: number = parseInt(paramMap.get('serialNumber'), 10);

      this.apiService.getCompleteSession(groupId, serialNumber)
        .subscribe((session) => this.session = session);
    });
  }

  updateGame($event: Game) {
    this.game = {...$event};
  }
}
