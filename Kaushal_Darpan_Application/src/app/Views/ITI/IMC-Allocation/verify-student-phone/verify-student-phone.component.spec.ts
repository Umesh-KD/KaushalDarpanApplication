import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyStudentPhoneComponent } from './verify-student-phone.component';

describe('VerifyStudentPhoneComponent', () => {
  let component: VerifyStudentPhoneComponent;
  let fixture: ComponentFixture<VerifyStudentPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyStudentPhoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyStudentPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
