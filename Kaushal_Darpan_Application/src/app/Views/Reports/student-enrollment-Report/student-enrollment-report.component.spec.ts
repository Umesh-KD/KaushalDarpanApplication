import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnrollmentReportComponent } from './student-enrollment-report.component';

describe('StudentEnrollmentComponent', () => {
  let component: StudentEnrollmentReportComponent;
  let fixture: ComponentFixture<StudentEnrollmentReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentEnrollmentReportComponent]
    });
    fixture = TestBed.createComponent(StudentEnrollmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
