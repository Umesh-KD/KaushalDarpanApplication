import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnrollmentApprovalRejectComponent } from './student-enrollment-approval-reject.component';

describe('StudentEnrollmentApprovalRejectComponent', () => {
  let component: StudentEnrollmentApprovalRejectComponent;
  let fixture: ComponentFixture<StudentEnrollmentApprovalRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentEnrollmentApprovalRejectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEnrollmentApprovalRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
