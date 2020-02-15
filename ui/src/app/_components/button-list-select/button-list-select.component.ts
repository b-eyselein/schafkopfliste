import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectableValue} from '../../_interfaces/selectable-value';

@Component({
  selector: 'skl-button-list-select',
  template: `
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label" [ngClass]="isValid ? 'has-text-danger' : ''">{{label}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <div class="columns is-multiline">
              <div class="column" *ngFor="let option of options">
                <button class="button is-fullwidth" (click)="onSelected(option)" [ngClass]="option.isSelected ? 'is-link' : ''"
                        [title]="option.title ? option.title : option.name" [disabled]="allDisabled || option.disabled">
                  {{option.name}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`
})
export class ButtonListSelectComponent<T> {

  @Input() label: string;
  @Input() options: SelectableValue<T | undefined>[];
  @Input() isValid: boolean;
  @Input() allDisabled: boolean = false;

  @Output() selected = new EventEmitter<T>();

  onSelected(option: SelectableValue<T>): void {
    if (option.isSelected) {
      option.isSelected = false;
      this.selected.emit(undefined);
    } else {
      this.options.forEach((o) => o.isSelected = false);

      option.isSelected = true;

      this.selected.emit(option.value);
    }
  }

}
