import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDashReportComponent } from './staff-dash-report.component';

describe('StaffDashReportComponent', () => {
  let component: StaffDashReportComponent;
  let fixture: ComponentFixture<StaffDashReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffDashReportComponent]
    });
    fixture = TestBed.createComponent(StaffDashReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
