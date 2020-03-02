import {Component, Input} from '@angular/core';
import {Player} from '../../_interfaces/interfaces';

@Component({
  selector: 'skl-player-abbreviations',
  template: `
    <ng-container *ngFor="let p of players; let last = last">
      <span title="{{p.name}}">{{p.abbreviation}}</span>

      <ng-container *ngIf="!last">, </ng-container>
    </ng-container>
  `
})
export class PlayerAbbreviationsComponent {

  @Input() players: Player[];

}
