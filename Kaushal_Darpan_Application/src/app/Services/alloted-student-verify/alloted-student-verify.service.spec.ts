import { TestBed } from '@angular/core/testing';

import { AllotedStudentVerifyService } from './alloted-student-verify.service';

describe('StudentEnrollmentService', () => {
  let service: AllotedStudentVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllotedStudentVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
