import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentCancelationVerifyComponent } from './enrollment-cancelation-verify.component';

describe('EnrollmentCancelationVerifyComponent', () => {
  let component: EnrollmentCancelationVerifyComponent;
  let fixture: ComponentFixture<EnrollmentCancelationVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrollmentCancelationVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentCancelationVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
