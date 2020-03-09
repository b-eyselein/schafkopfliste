import {Component, OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {Group, GroupWithPlayerCount, UserWithToken} from '../_interfaces/interfaces';
import {AuthenticationService} from '../_services/authentication.service';

@Component({templateUrl: './group-list.component.html'})
export class GroupListComponent implements OnInit {

  currentUser: UserWithToken;
  groups: GroupWithPlayerCount[];

  constructor(private authenticationService: AuthenticationService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.authenticationService.currentUser
      .subscribe((u) => this.currentUser = u);

    this.apiService.getGroupsWithPlayerCount()
      .subscribe((groups) => this.groups = groups);
  }

  onGroupCreated(group: Group) {
    this.groups.push({...group, playerCount: 0});
  }
}
