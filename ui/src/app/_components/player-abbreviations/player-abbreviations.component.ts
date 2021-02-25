import {Component, Input} from '@angular/core';
import {SessionPlayerFragment} from '../../_services/apollo_services';

@Component({
  selector: 'skl-player-abbreviations',
  template: `
    <ng-container *ngFor="let p of players; let last = last">
      <span title="{{p.name}}">{{p.abbreviation}}</span>

      <ng-container *ngIf="!last">,</ng-container>
    </ng-container>
  `
})
export class PlayerAbbreviationsComponent {

  @Input() players: SessionPlayerFragment[];

}
