import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IitPaperUploadReportComponent } from './iit-paper-upload-report.component';

describe('IitPaperUploadReportComponent', () => {
  let component: IitPaperUploadReportComponent;
  let fixture: ComponentFixture<IitPaperUploadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IitPaperUploadReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IitPaperUploadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
