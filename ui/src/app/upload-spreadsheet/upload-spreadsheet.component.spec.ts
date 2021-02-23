import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadSpreadsheetComponent } from './upload-spreadsheet.component';

describe('UploadSpreadsheetComponent', () => {
  let component: UploadSpreadsheetComponent;
  let fixture: ComponentFixture<UploadSpreadsheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSpreadsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
