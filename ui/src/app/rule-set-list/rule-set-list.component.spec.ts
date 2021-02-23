import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RuleSetListComponent } from './rule-set-list.component';

describe('RuleSetListComponent', () => {
  let component: RuleSetListComponent;
  let fixture: ComponentFixture<RuleSetListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleSetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
