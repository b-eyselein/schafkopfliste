import {Component, OnDestroy, OnInit} from '@angular/core';
import {RuleSetListGQL, RuleSetListQuery} from '../_services/apollo_services';
import {Subscription} from 'rxjs';

@Component({templateUrl: './rule-set-list.component.html'})
export class RuleSetListComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  ruleSetListQuery: RuleSetListQuery;

  constructor(private ruleSetListGQL: RuleSetListGQL) {
  }

  ngOnInit() {
    this.sub = this.ruleSetListGQL
      .watch()
      .valueChanges
      .subscribe(({data}) => this.ruleSetListQuery = data);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
