import {Component, Input} from '@angular/core';
import {SessionPlayerFragment} from '../../_services/apollo_services';

@Component({
  selector: 'skl-player-abbreviations',
  template: `
    <ng-container *ngFor="let p of players; let last = last">
      <span title="{{p.firstName}} {{p.lastName}}">{{p.nickname}}</span>

      <ng-container *ngIf="!last">,</ng-container>
    </ng-container>
  `
})
export class PlayerAbbreviationsComponent {

  @Input() players: SessionPlayerFragment[];

}
