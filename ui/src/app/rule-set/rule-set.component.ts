import {Component, Input} from '@angular/core';
import {RuleSetFragment} from '../_services/apollo_services';

@Component({
  template: `
    <pre>{{ruleSet | json}}</pre>`
})
export class RuleSetComponent {

  @Input() ruleSet: RuleSetFragment;

}
