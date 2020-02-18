import {Component, Input} from '@angular/core';
import {RuleSet} from '../_interfaces/ruleset';

@Component({
  selector: 'skl-rule-set',
  template: `
    <pre>{{ruleSet | json}}</pre>
  `
})
export class RuleSetComponent {

  @Input() ruleSet: RuleSet;

}
