import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerReportAndMarksTrackingComponent } from './examiner-report-and-marks-tracking.component';

describe('ExaminerReportAndMarksTrackingComponent', () => {
  let component: ExaminerReportAndMarksTrackingComponent;
  let fixture: ComponentFixture<ExaminerReportAndMarksTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExaminerReportAndMarksTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminerReportAndMarksTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
