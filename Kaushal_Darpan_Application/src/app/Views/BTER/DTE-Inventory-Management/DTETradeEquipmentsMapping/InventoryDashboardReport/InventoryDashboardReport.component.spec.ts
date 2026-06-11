import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDashboardReportComponent } from './InventoryDashboardReport.component';

describe('InventoryDashboardReportComponent', () => {
  let component: InventoryDashboardReportComponent;
  let fixture: ComponentFixture<InventoryDashboardReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryDashboardReportComponent]
    });
    fixture = TestBed.createComponent(InventoryDashboardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
