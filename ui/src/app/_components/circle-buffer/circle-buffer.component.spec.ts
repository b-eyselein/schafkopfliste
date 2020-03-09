import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleBufferComponent } from './circle-buffer.component';

describe('CircleBufferComponent', () => {
  let component: CircleBufferComponent;
  let fixture: ComponentFixture<CircleBufferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleBufferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleBufferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
