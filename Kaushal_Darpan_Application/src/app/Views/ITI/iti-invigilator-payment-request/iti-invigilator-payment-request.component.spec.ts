import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIInvigilatorPaymentRequestComponent } from './iti-invigilator-payment-request.component';

describe('ITIInvigilatorPaymentRequestComponent', () => {
  let component: ITIInvigilatorPaymentRequestComponent;
  let fixture: ComponentFixture<ITIInvigilatorPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIInvigilatorPaymentRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIInvigilatorPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
