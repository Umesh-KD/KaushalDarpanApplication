import { TestBed } from '@angular/core/testing';

import { StudentEnrollmentCancelationService } from './student-enrollment-cancelation.service';

describe('StudentEnrollmentCancelationService', () => {
  let service: StudentEnrollmentCancelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentEnrollmentCancelationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
