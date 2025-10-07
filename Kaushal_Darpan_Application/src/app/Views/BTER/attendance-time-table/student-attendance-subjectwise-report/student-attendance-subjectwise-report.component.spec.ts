import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAttendanceSubjectwiseReportComponent } from './student-attendance-subjectwise-report.component';

describe('StudentAttendanceSubjectwiseReportComponent', () => {
  let component: StudentAttendanceSubjectwiseReportComponent;
  let fixture: ComponentFixture<StudentAttendanceSubjectwiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAttendanceSubjectwiseReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAttendanceSubjectwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
