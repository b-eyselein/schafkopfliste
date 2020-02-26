import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAbbreviationsComponent } from './player-abbreviations.component';

describe('PlayerAbbreviationsComponent', () => {
  let component: PlayerAbbreviationsComponent;
  let fixture: ComponentFixture<PlayerAbbreviationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerAbbreviationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAbbreviationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
