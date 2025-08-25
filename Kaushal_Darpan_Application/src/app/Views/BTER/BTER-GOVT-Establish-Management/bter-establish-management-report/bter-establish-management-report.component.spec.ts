import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterEstablishManagementReportComponent } from './bter-establish-management-report.component';

describe('BterEstablishManagementReportComponent', () => {
  let component: BterEstablishManagementReportComponent;
  let fixture: ComponentFixture<BterEstablishManagementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterEstablishManagementReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterEstablishManagementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
