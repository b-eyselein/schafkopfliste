import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectableValue} from '../../_interfaces/selectable-value';

@Component({
  selector: 'skl-button-list-select',
  template: `
    <div class="columns is-multiline">
      <div class="column" *ngFor="let option of options">
        <button class="button is-fullwidth" (click)="onSelected(option)" [ngClass]="option.isSelected ? 'is-link' : ''"
                [title]="option.title ? option.title : option.name">
          {{option.name}}
        </button>
      </div>
    </div>`
})
export class ButtonListSelectComponent<T> {

  @Input() options: SelectableValue<T>[];
  @Output() selected = new EventEmitter<T>();

  onSelected(option: SelectableValue<T>): void {
    this.options.forEach((o) => o.isSelected = false);

    option.isSelected = true;

    this.selected.emit(option.value);
  }

}
