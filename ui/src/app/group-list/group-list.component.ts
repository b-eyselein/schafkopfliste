import {Component, OnInit} from '@angular/core';
import {Group, UserWithToken} from '../_interfaces/interfaces';
import {AuthenticationService} from '../_services/authentication.service';
import {GroupListGQL, GroupListQuery} from '../_services/apollo_services';


@Component({templateUrl: './group-list.component.html'})
export class GroupListComponent implements OnInit {

  currentUser: UserWithToken;
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

  onGroupCreated(group: Group) {
    this.groupListQuery.groups.push({
      id: group.id,
      name: group.name,
      playerCount: 0
    });
  }
}
