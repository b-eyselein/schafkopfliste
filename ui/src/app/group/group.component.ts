import {Component, OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {Group} from '../_interfaces/group';
import {ActivatedRoute} from '@angular/router';
import {Player} from '../_interfaces/player';

@Component({templateUrl: './group.component.html'})
export class GroupComponent implements OnInit {

  group: Group;
  players: Player[];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'));

      this.apiService.getGroup(groupId)
        .subscribe((group) => this.group = group);

      this.apiService.getPlayersInGroup(groupId)
        .subscribe((players) => this.players = players);
    })
  }

}
