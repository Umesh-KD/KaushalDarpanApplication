import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportedStudentReportComponent } from './report-for-admin.component';

describe('AllotmentReportCollegeComponent', () => {
  let component: ReportedStudentReportComponent;
  let fixture: ComponentFixture<ReportedStudentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportedStudentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportedStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
