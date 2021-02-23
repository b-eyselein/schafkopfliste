import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewGameComponent } from './new-game.component';

describe('NewGameComponent', () => {
  let component: NewGameComponent;
  let fixture: ComponentFixture<NewGameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
