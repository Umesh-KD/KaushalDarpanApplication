import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllotmentReportCollegeAdminComponent } from './allotment-report-college-admin.component';

describe('AllotmentReportCollegeAdminComponent', () => {
  let component: AllotmentReportCollegeAdminComponent;
  let fixture: ComponentFixture<AllotmentReportCollegeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllotmentReportCollegeAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentReportCollegeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
