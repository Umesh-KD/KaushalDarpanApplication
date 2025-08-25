import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementDashReportComponent } from './placement-dash-report.component';

describe('PlacementDashReportComponent', () => {
  let component: PlacementDashReportComponent;
  let fixture: ComponentFixture<PlacementDashReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementDashReportComponent]
    });
    fixture = TestBed.createComponent(PlacementDashReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
