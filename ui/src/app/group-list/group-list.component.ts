import {Component, OnInit} from '@angular/core';
import {Group} from '../_interfaces/interfaces';
// import {AuthenticationService} from '../_services/authentication.service';
import {GroupListGQL, GroupListQuery} from '../_services/apollo_services';


@Component({templateUrl: './group-list.component.html'})
export class GroupListComponent implements OnInit {

  groupListQuery: GroupListQuery;

  constructor(/* private authenticationService: AuthenticationService, */private groupListGQL: GroupListGQL) {
  }

  ngOnInit() {
    // const jwt = this.authenticationService.currentUserValue.token;

    this.groupListGQL
      .watch()
      .valueChanges
      .subscribe(({data}) => this.groupListQuery = data);
  }

  onGroupCreated(group: Group) {
    this.groupListQuery.groups.push({
      id: group.id,
      name: group.name,
      playerCount: 0
    });
  }
}
