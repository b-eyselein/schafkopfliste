import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRuleSetComponent } from './create-rule-set.component';

describe('RuleSetFormComponent', () => {
  let component: CreateRuleSetComponent;
  let fixture: ComponentFixture<CreateRuleSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRuleSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRuleSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
