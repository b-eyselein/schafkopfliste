import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectableValue} from '../../_interfaces/selectable-value';

@Component({
  selector: 'skl-button-list-select',
  templateUrl: './button-list-select.component.html'
})
export class ButtonListSelectComponent<T> {

  @Input() label: string;
  @Input() options: SelectableValue<T>[];

  @Output() selected = new EventEmitter<T>();

  onSelected(option: SelectableValue<T>): void {
    this.options.forEach((o) => o.isSelected = false);

    option.isSelected = true;

    this.selected.emit(option.value);
  }

}
