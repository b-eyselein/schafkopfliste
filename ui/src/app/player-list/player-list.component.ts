import {Component, OnInit} from '@angular/core';
import {Player, PlayerListGQL, PlayerListQuery} from '../_services/apollo_services';

@Component({templateUrl: './player-list.component.html'})
export class PlayerListComponent implements OnInit {

  playerListQuery: PlayerListQuery;

  constructor(private playerListGQL: PlayerListGQL) {
  }

  ngOnInit() {
    this.playerListGQL
      .watch()
      .valueChanges
      .subscribe(({data}: {data: PlayerListQuery}) => this.playerListQuery = data);
  }

  onPlayerCreated(player: Player) {
    this.playerListQuery.players.push(player);
  }
}
