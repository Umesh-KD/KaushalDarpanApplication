import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPModalComponent } from './otpmodal.component';

describe('OTPModalComponent', () => {
  let component: OTPModalComponent;
  let fixture: ComponentFixture<OTPModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OTPModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OTPModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
