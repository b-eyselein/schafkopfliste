import {Component, OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {GroupGQL, GroupQuery, LoggedInUserFragment, PlayerInGroupFragment} from '../_services/apollo_services';

@Component({templateUrl: './group.component.html'})
export class GroupComponent implements OnInit {

  currentUser: LoggedInUserFragment | undefined;

  groupQuery: GroupQuery;

  groupName: string;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private groupGqlService: GroupGQL
  ) {
  }

  getPlayersOrderedByBalance(): PlayerInGroupFragment[] {
    return this.groupQuery.group.players.sort((a, b) => a.balance - b.balance);
  }

  ngOnInit() {
    this.authenticationService.currentUser
      .subscribe((u) => this.currentUser = u);

    this.route.paramMap.subscribe((paramMap) => {
      this.groupName = paramMap.get('groupName');

      this.groupGqlService
        .watch({name: this.groupName})
        .valueChanges
        .subscribe(({data}: { data: GroupQuery }) => this.groupQuery = data);
    });
  }

  recalculateStatistics() {
    console.error('TODO!');
    /*
    this.apiService.getRecalculatedStatistics(this.group.id)
      .subscribe((result) => {
        // tslint:disable-next-line:no-console
        console.info(JSON.stringify(result, null, 2));
      });
     */
  }
}
