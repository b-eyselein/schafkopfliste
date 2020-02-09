import {Component, OnInit} from '@angular/core';
import {ApiService} from "../_services/api.service";
import {Group} from "../_interfaces/model";

@Component({templateUrl: './groups.component.html'})
export class GroupsComponent implements OnInit {

  groups: Group[];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getGroups()
      .subscribe((groups) => this.groups = groups);
  }

}
