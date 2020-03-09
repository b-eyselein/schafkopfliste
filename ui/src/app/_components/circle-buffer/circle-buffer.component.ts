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

  @Input() label: string;
  @Input() values: CircleBufferSelectable<T>[];

  @Output() newValue = new EventEmitter<T>();

  allValues: (T | undefined)[];

  currentValue: T | undefined;

  currentIndex: number;

  ngOnInit(): void {
    this.currentIndex = 0;
    this.updateValue();
  }

  private updateValue(): void {
    console.info(this.currentIndex);

    this.currentValue = this.allValues[this.currentIndex];
    this.newValue.emit(this.currentValue);
  }

  priorValue(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateValue();
    }
  }

  nextValue(): void {
    if (this.currentIndex < this.allValues.length - 1) {
      this.currentIndex++;
      this.updateValue();
    }
  }

}
