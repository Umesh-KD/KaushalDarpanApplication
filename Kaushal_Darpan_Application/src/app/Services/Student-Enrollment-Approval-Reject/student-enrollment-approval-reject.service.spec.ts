import { TestBed } from '@angular/core/testing';

import { StudentEnrollmentApprovalRejectService } from './student-enrollment-approval-reject.service';

describe('StudentEnrollmentApprovalRejectService', () => {
  let service: StudentEnrollmentApprovalRejectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentEnrollmentApprovalRejectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
