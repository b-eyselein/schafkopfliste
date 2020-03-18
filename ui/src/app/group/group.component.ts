import {Component, OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {ActivatedRoute} from '@angular/router';
import {GroupWithPlayersAndRuleSet, PlayerWithGroupResult, Session, UserWithToken} from '../_interfaces/interfaces';
import {AuthenticationService} from '../_services/authentication.service';
import {GroupGqlService} from './group-gql.service';

@Component({templateUrl: './group.component.html'})
export class GroupComponent implements OnInit {

  currentUser: UserWithToken | undefined;

  group: GroupWithPlayersAndRuleSet;
  sessions: Session[];

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
        .subscribe(({data}) => console.info(JSON.stringify(data, null, 2)));

      this.apiService.getGroupWithPlayersAndRuleSet(groupId)
        .subscribe((groupWithPlayers) => this.group = groupWithPlayers);

      this.apiService.getSessions(groupId)
        .subscribe((sessions) => this.sessions = sessions);
    });
  }

  recalculateStatistics() {
    this.apiService.getRecalculatedStatistics(this.group.id)
      .subscribe((result) => {
        console.info(JSON.stringify(result, null, 2));
      });
  }
}
