import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIStudentAllotmentReportComponent } from './student-allotment-report.component';

describe('PlacementDashReportComponent', () => {
  let component: ITIStudentAllotmentReportComponent;
  let fixture: ComponentFixture<ITIStudentAllotmentReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIStudentAllotmentReportComponent]
    });
    fixture = TestBed.createComponent(ITIStudentAllotmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
