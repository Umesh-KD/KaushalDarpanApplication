import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentServiceComponent } from './add-payment-service.component';

describe('AddPaymentServiceComponent', () => {
  let component: AddPaymentServiceComponent;
  let fixture: ComponentFixture<AddPaymentServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPaymentServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPaymentServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
