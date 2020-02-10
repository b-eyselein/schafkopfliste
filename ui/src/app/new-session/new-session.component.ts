import {Component, OnInit} from '@angular/core';
import {Group} from '../_interfaces/group';
import {Player} from '../_interfaces/player';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';

@Component({templateUrl: './new-session.component.html'})
export class NewSessionComponent implements OnInit {

  group: Group;
  players: Player[];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroup(groupId).subscribe((g) => this.group = g);
      this.apiService.getPlayersInGroup(groupId).subscribe((ps) => this.players = ps);
    });
  }

}
