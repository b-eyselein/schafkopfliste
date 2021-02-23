import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerAbbreviationsComponent } from './player-abbreviations.component';

describe('PlayerAbbreviationsComponent', () => {
  let component: PlayerAbbreviationsComponent;
  let fixture: ComponentFixture<PlayerAbbreviationsComponent>;

  beforeEach(waitForAsync(() => {
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
