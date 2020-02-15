import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersInGroupComponent } from './players-in-group.component';

describe('PlayersInGroupComponent', () => {
  let component: PlayersInGroupComponent;
  let fixture: ComponentFixture<PlayersInGroupComponent>;

  beforeEach(async(() => {
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
