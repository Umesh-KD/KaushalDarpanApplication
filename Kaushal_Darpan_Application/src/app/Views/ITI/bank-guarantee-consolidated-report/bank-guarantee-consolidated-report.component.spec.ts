import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankGuaranteeConsolidatedReportComponent } from './bank-guarantee-consolidated-report.component';

describe('BankGuaranteeConsolidatedReportComponent', () => {
  let component: BankGuaranteeConsolidatedReportComponent;
  let fixture: ComponentFixture<BankGuaranteeConsolidatedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankGuaranteeConsolidatedReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankGuaranteeConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
