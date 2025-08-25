import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegePaymentStatusComponent } from './college-payment-status.component';

describe('CollegePaymentStatusComponent', () => {
  let component: CollegePaymentStatusComponent;
  let fixture: ComponentFixture<CollegePaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollegePaymentStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegePaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
