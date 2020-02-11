import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonListSelectComponent } from './button-list-select.component';

describe('SelectComponent', () => {
  let component: ButtonListSelectComponent;
  let fixture: ComponentFixture<ButtonListSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonListSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonListSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
