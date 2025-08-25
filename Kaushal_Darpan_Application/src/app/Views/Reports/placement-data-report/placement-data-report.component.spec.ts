import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementDataReportComponent } from './placement-data-report.component';

describe('PlacementDataReportComponent', () => {
  let component: PlacementDataReportComponent;
  let fixture: ComponentFixture<PlacementDataReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlacementDataReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementDataReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
