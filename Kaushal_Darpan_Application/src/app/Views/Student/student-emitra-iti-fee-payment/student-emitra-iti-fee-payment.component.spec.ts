import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEmitraITIFeePaymentComponent } from './student-emitra-iti-fee-payment.component';

describe('StudentEmitraITIFeePaymentComponent', () => {
  let component: StudentEmitraITIFeePaymentComponent;
  let fixture: ComponentFixture<StudentEmitraITIFeePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentEmitraITIFeePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEmitraITIFeePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
