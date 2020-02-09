import {Component, OnInit} from '@angular/core';
import {ApiService} from "../_services/api.service";
import {GroupWithPlayerCount} from "../_interfaces/model";

@Component({templateUrl: './groups.component.html'})
export class GroupsComponent implements OnInit {

  groups: GroupWithPlayerCount[];

  constructor(private apiService: ApiService) {
  }

  private updatePlayerCount(group: GroupWithPlayerCount): void {
    this.apiService.getPlayerCountInGroup(group.id)
      .subscribe((playerCount) => group.playerCount = playerCount)
  }

  ngOnInit() {
    this.apiService.getGroups()
      .subscribe((groups) => {
        this.groups = groups;

        this.groups.forEach((g) => this.updatePlayerCount(g));
      });
  }

}
