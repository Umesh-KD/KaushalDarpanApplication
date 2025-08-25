import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITINcvtDashboardInstituteReportComponent } from './iti-ncvt-dashboard-institute-report.component';

describe('ITINcvtDashboardInstituteReportComponent', () => {
  let component: ITINcvtDashboardInstituteReportComponent;
  let fixture: ComponentFixture<ITINcvtDashboardInstituteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITINcvtDashboardInstituteReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITINcvtDashboardInstituteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
