import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicantStudentReportComponent } from './applicant-student-report.component';

describe('AllotmentReportCollegeComponent', () => {
  let component: ApplicantStudentReportComponent;
  let fixture: ComponentFixture<ApplicantStudentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicantStudentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
