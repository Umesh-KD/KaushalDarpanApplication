import { TestBed } from '@angular/core/testing';

import { EnrolledPromotedStudentVerifyService } from './enrolled-promoted-student-verify.service';

describe('StudentEnrollmentService', () => {
  let service: EnrolledPromotedStudentVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrolledPromotedStudentVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
