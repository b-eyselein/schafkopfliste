import {Component, OnInit} from '@angular/core';
import {Player, PlayerListGqlService} from './player-list-gql.service';

@Component({templateUrl: './player-list.component.html'})
export class PlayerListComponent implements OnInit {

  players: Player[];

  constructor(private playerListGqlService: PlayerListGqlService) {
  }

  ngOnInit() {
    this.playerListGqlService
      .watch()
      .valueChanges
      .subscribe(({data}) => this.players = data.players);
  }

  onPlayerCreated(player: Player) {
    this.players.push(player);
  }
}
