import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SelectableValue} from '../../_interfaces/selectable-value';

@Component({
  selector: 'skl-button-list-select',
  templateUrl: './button-list-select.component.html'
})
export class ButtonListSelectComponent<T> implements OnChanges {

  @Input() label: string;
  @Input() options: SelectableValue<T | undefined>[];

  @Input() required: boolean;

  @Input() submitted: boolean;
  @Input() isValid: boolean;

  @Output() selected = new EventEmitter<T | undefined>();

  private selectedVal: T;

  valid = false;

  set theSelectedVal(t: T | undefined) {
    this.selected.emit(t);
    this.selectedVal = t;
  }

  get theSelectedVal(): T {
    return this.selectedVal;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.valid = !this.required || !!this.selectedVal;
    console.info(this.label + ' :: ' + this.valid);
  }

}
