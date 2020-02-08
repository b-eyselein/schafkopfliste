import {Component, OnInit} from '@angular/core';
import {ApiService} from "../_services/api.service";
import {Player} from "../_interfaces/player";

@Component({templateUrl: './player-list.component.html'})
export class PlayerListComponent implements OnInit {

  players: Player[];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getPlayers()
      .subscribe((players) => this.players = players);
  }

}
