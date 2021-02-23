import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RuleSetComponent } from './rule-set.component';

describe('RuleSetComponent', () => {
  let component: RuleSetComponent;
  let fixture: ComponentFixture<RuleSetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
