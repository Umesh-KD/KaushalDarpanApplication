import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIPlacementDashReportComponent } from './placement-dash-report.component';

describe('PlacementDashReportComponent', () => {
  let component: ITIPlacementDashReportComponent;
  let fixture: ComponentFixture<ITIPlacementDashReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIPlacementDashReportComponent]
    });
    fixture = TestBed.createComponent(ITIPlacementDashReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
