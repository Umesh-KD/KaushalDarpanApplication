import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeWiseScholarshipReportComponent } from './college-wise-scholarship-report.component';

describe('CompanyMasterComponent', () => {
  let component: CollegeWiseScholarshipReportComponent;
  let fixture: ComponentFixture<CollegeWiseScholarshipReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegeWiseScholarshipReportComponent]
    });
    fixture = TestBed.createComponent(CollegeWiseScholarshipReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
