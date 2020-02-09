import {Component, OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {Group, GroupWithPlayerCount} from '../_interfaces/group';

@Component({templateUrl: './group-list.component.html'})
export class GroupListComponent implements OnInit {

  groups: GroupWithPlayerCount[];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getGroupsWithPlayerCount()
      .subscribe((groups) => this.groups = groups);
  }

  onGroupCreated(group: Group) {
    this.groups.push({...group, playerCount: 0});
  }
}
