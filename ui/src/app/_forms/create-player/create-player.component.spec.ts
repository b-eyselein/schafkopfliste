import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreatePlayerComponent } from './create-player.component';

describe('NewPlayerFormComponent', () => {
  let component: CreatePlayerComponent;
  let fixture: ComponentFixture<CreatePlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
