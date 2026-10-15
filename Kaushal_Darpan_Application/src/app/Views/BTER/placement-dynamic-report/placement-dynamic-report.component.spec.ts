import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementDynamicReportComponent } from './placement-dynamic-report.component';

describe('PlacementDynamicReportComponent', () => {
  let component: PlacementDynamicReportComponent;
  let fixture: ComponentFixture<PlacementDynamicReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementDynamicReportComponent]
    });
    fixture = TestBed.createComponent(PlacementDynamicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
