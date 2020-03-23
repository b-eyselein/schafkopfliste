import {Component, OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {ActivatedRoute} from '@angular/router';
import {GroupWithPlayersAndRuleSet, PlayerWithGroupResult, UserWithToken} from '../_interfaces/interfaces';
import {AuthenticationService} from '../_services/authentication.service';
import {Group, GroupGqlService} from './group-gql.service';

@Component({templateUrl: './group.component.html'})
export class GroupComponent implements OnInit {

  currentUser: UserWithToken | undefined;

  group: GroupWithPlayersAndRuleSet;
  apolloGroup: Group;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private groupGqlService: GroupGqlService
  ) {
  }

  getPlayersOrderedByBalance(): PlayerWithGroupResult[] {
    return this.group.players.sort((a, b) => b.sessionResult.balance - a.sessionResult.balance);
  }

  ngOnInit() {
    this.authenticationService.currentUser
      .subscribe((u) => this.currentUser = u);

    this.route.paramMap.subscribe((paramMap) => {
      const groupId = parseInt(paramMap.get('groupId'), 10);

      this.groupGqlService
        .watch({id: groupId})
        .valueChanges
        .subscribe(({data}) => this.apolloGroup = data.group);

      this.apiService.getGroupWithPlayersAndRuleSet(groupId)
        .subscribe((groupWithPlayers) => this.group = groupWithPlayers);
    });
  }

  recalculateStatistics() {
    this.apiService.getRecalculatedStatistics(this.group.id)
      .subscribe((result) => {
        console.info(JSON.stringify(result, null, 2));
      });
  }
}
