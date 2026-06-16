import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemReportComponent } from './inventory-item-report.component';

describe('InventoryItemReportComponent', () => {
  let component: InventoryItemReportComponent;
  let fixture: ComponentFixture<InventoryItemReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryItemReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryItemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
