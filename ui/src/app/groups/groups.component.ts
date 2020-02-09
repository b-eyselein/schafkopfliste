import {Component, OnInit} from '@angular/core';
import {ApiService} from "../_services/api.service";
import {GroupWithPlayerCount} from "../_interfaces/group";

@Component({templateUrl: './groups.component.html'})
export class GroupsComponent implements OnInit {

  groups: GroupWithPlayerCount[];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getGroupsWithPlayerCount()
      .subscribe((groups) => this.groups = groups);
  }

}
