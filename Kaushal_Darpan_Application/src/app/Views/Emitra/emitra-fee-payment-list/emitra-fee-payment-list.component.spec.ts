import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitraFeePaymentListComponent } from './emitra-fee-payment-list.component';

describe('EmitraFeePaymentListComponent', () => {
  let component: EmitraFeePaymentListComponent;
  let fixture: ComponentFixture<EmitraFeePaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmitraFeePaymentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmitraFeePaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
