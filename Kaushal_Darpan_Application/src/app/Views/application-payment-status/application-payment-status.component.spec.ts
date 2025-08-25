import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPaymentStatusComponent } from './application-payment-status.component';

describe('ApplicationPaymentStatusComponent', () => {
  let component: ApplicationPaymentStatusComponent;
  let fixture: ComponentFixture<ApplicationPaymentStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationPaymentStatusComponent]
    });
    fixture = TestBed.createComponent(ApplicationPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
