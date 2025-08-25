import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllotmentReportCollegeComponent } from './allotment-report-college.component';

describe('AllotmentReportCollegeComponent', () => {
  let component: AllotmentReportCollegeComponent;
  let fixture: ComponentFixture<AllotmentReportCollegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllotmentReportCollegeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentReportCollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
