import {Component, OnInit} from '@angular/core';
import {ApiService} from "../_services/api.service";
import {Group} from "../_interfaces/model";
import {ActivatedRoute} from "@angular/router";

@Component({templateUrl: './group.component.html'})
export class GroupComponent implements OnInit {

  group: Group;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.apiService.getGroup(parseInt(paramMap.get('groupId')))
        .subscribe((group) => this.group = group);
    })
  }

}
