import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {GroupListGQL, GroupListQuery, LoggedInUserFragment} from '../_services/apollo_services';

@Component({templateUrl: './group-list.component.html'})
export class GroupListComponent implements OnInit {

  currentUser: LoggedInUserFragment;
  groupListQuery: GroupListQuery;

  constructor(private authenticationService: AuthenticationService, private groupListGQL: GroupListGQL) {
  }

  ngOnInit() {
    this.authenticationService.currentUser
      .subscribe((u) => this.currentUser = u);

    this.groupListGQL
      .watch()
      .valueChanges
      .subscribe(({data}) => this.groupListQuery = data);
  }
}
