import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreExamStudentVerificationComponent } from './pre-exam-student-verification.component';

describe('PreExamStudentVerificationComponent', () => {
  let component: PreExamStudentVerificationComponent;
  let fixture: ComponentFixture<PreExamStudentVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreExamStudentVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreExamStudentVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
