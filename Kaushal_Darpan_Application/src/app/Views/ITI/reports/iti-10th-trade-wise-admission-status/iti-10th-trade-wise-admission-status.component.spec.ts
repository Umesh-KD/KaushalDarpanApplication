import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iti10ThTradeWiseAdmissionStatusComponent } from './iti-10th-trade-wise-admission-status.component';

describe('Iti10ThTradeWiseAdmissionStatus', () => {
  let component: Iti10ThTradeWiseAdmissionStatusComponent;
  let fixture: ComponentFixture<Iti10ThTradeWiseAdmissionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iti10ThTradeWiseAdmissionStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iti10ThTradeWiseAdmissionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
