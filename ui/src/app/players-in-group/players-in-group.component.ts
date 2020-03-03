import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {GroupWithPlayersAndMembership} from '../_interfaces/group';
import {Player} from '../_interfaces/interfaces';

@Component({templateUrl: './players-in-group.component.html'})
export class PlayersInGroupComponent implements OnInit {

  group: GroupWithPlayersAndMembership;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayersAndMembership(groupId)
        .subscribe((group) => {
          this.group = group;

          console.info(JSON.stringify(this.group.players, null, 2));
        });
    });
  }

  addPlayerToGroup(p: { player: Player, isMember: boolean }): void {
    this.apiService.addPlayerToGroup(this.group.group.id, p.player.id)
      .subscribe((isMember) => p.isMember = isMember);
  }

}
