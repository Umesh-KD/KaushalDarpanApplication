import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalMarksReportCollegeWiseComponent } from './InternalMarksReportCollegeWise.component';

describe('CompanyMasterComponent', () => {
  let component:  InternalMarksReportCollegeWiseComponent;
  let fixture: ComponentFixture<InternalMarksReportCollegeWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalMarksReportCollegeWiseComponent]
    });
    fixture = TestBed.createComponent(InternalMarksReportCollegeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
