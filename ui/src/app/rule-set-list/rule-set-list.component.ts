import {Component, OnInit} from '@angular/core';
import {RuleSetListGQL, RuleSetListQuery} from '../_services/apollo_services';

@Component({templateUrl: './rule-set-list.component.html'})
export class RuleSetListComponent implements OnInit {

  ruleSetListQuery: RuleSetListQuery;

  constructor(private ruleSetListGQL: RuleSetListGQL) {
  }

  ngOnInit() {
    this.ruleSetListGQL
      .watch()
      .valueChanges
      .subscribe(({data}) => this.ruleSetListQuery = data);
  }

}
