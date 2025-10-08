import { TestBed } from '@angular/core/testing';

import { TeacherHigherEducationApplicationVerificationService } from './teacher-higher-education-application-Verification.service';

describe('StudentEnrollmentService', () => {
  let service: TeacherHigherEducationApplicationVerificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherHigherEducationApplicationVerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
