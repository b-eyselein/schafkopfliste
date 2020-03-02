import {Component, OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {RuleSet} from '../_interfaces/interfaces';

@Component({templateUrl: './rule-set-list.component.html'})
export class RuleSetListComponent implements OnInit {

  ruleSets: RuleSet[];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getRuleSets()
      .subscribe((ruleSets) => this.ruleSets = ruleSets);
  }

}
