import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayersInGroupComponent } from './players-in-group.component';

describe('PlayersInGroupComponent', () => {
  let component: PlayersInGroupComponent;
  let fixture: ComponentFixture<PlayersInGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersInGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersInGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
