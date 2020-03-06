import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {GroupWithPlayerMembership, PlayerAndMembership} from '../_interfaces/interfaces';

@Component({templateUrl: './players-in-group.component.html'})
export class PlayersInGroupComponent implements OnInit {

  groupWithPlayerMembership: GroupWithPlayerMembership;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayersAndMembership(groupId)
        .subscribe((groupWithPlayerMembership) => this.groupWithPlayerMembership = groupWithPlayerMembership);
    });
  }

  toggleGroupMembership(p: PlayerAndMembership): void {
    this.apiService.toggleGroupMembershipForPlayer(this.groupWithPlayerMembership.group.id, p.player.id, !p.isMember)
      .subscribe((isMember) => p.isMember = isMember);
  }

}
