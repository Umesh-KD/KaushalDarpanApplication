import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iti8ThTradeWiseAdmissionStatusComponent } from './iti-8th-trade-wise-admission-status.component';

describe('Iti8ThTradeWiseAdmissionStatus', () => {
  let component: Iti8ThTradeWiseAdmissionStatusComponent;
  let fixture: ComponentFixture<Iti8ThTradeWiseAdmissionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iti8ThTradeWiseAdmissionStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iti8ThTradeWiseAdmissionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
