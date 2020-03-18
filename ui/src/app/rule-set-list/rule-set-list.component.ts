import {Component, OnInit} from '@angular/core';
import {RuleSet} from '../_interfaces/interfaces';
import {RuleSetListGqlService} from './rule-set-list-gql.service';

@Component({templateUrl: './rule-set-list.component.html'})
export class RuleSetListComponent implements OnInit {

  ruleSets: RuleSet[];

  constructor(private ruleSetListGqlService: RuleSetListGqlService) {
  }

  ngOnInit() {
    this.ruleSetListGqlService
      .watch()
      .valueChanges
      .subscribe(({data}) => this.ruleSets = data.ruleSets);
  }

}
