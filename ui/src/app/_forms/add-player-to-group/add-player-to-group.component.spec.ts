import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlayerToGroupComponent } from './add-player-to-group.component';

describe('AddPlayerToGroupComponent', () => {
  let component: AddPlayerToGroupComponent;
  let fixture: ComponentFixture<AddPlayerToGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlayerToGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlayerToGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
