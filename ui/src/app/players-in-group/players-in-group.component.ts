import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../_services/api.service';
import {GroupWithPlayersAndRuleSet} from '../_interfaces/group';

@Component({templateUrl: './players-in-group.component.html'})
export class PlayersInGroupComponent implements OnInit {

  group: GroupWithPlayersAndRuleSet;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.apiService.getGroupWithPlayersAndRuleSet(groupId)
        .subscribe((group) => this.group = group);
    });
  }

}
