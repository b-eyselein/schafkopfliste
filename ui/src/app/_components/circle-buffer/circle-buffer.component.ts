import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface CircleBufferSelectable<T> {
  name: string;
  value: T | undefined;
}

@Component({
  selector: 'skl-circle-buffer',
  templateUrl: './circle-buffer.component.html'
})
export class CircleBufferComponent<T> implements OnInit {

  @Input() values: CircleBufferSelectable<T>[];

  @Output() newValue = new EventEmitter<T>();

  currentValue: T | undefined;

  currentIndex: number;

  ngOnInit(): void {
    this.currentIndex = 0;

    this.currentValue = this.values[this.currentIndex].value;
  }

  private updateValue(): void {
    this.currentValue = this.values[this.currentIndex].value;
    this.newValue.emit(this.currentValue);
  }

  priorValue(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateValue();
    }
  }

  nextValue(): void {
    if (this.currentIndex < this.values.length - 1) {
      this.currentIndex++;
      this.updateValue();
    }
  }

}
