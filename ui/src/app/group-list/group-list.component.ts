import {Component, OnInit} from '@angular/core';
import {Group, UserWithToken} from '../_interfaces/interfaces';
import {AuthenticationService} from '../_services/authentication.service';
import {BasicGroup, GroupListGqlService} from './group-list-gql.service';


@Component({templateUrl: './group-list.component.html'})
export class GroupListComponent implements OnInit {

  currentUser: UserWithToken;
  groups: BasicGroup[];

  constructor(
    private authenticationService: AuthenticationService,
    private groupListGQL: GroupListGqlService,
  ) {
  }

  ngOnInit() {
    this.authenticationService.currentUser
      .subscribe((u) => this.currentUser = u);

    this.groupListGQL
      .watch()
      .valueChanges
      .subscribe(({data}) => this.groups = data.groups);
  }

  onGroupCreated(group: Group) {
    this.groups.push({
      id: group.id,
      name: group.name,
      playerCount: 0
    });
  }
}
