import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyStudentApplicationComponent } from './verify-student-application.component';

describe('VerifyStudentApplicationComponent', () => {
  let component: VerifyStudentApplicationComponent;
  let fixture: ComponentFixture<VerifyStudentApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyStudentApplicationComponent]
    });
    fixture = TestBed.createComponent(VerifyStudentApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
