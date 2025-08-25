import { TestBed } from '@angular/core/testing';

import { ITIStudentEnrollmentService } from './itistudent-enrollment.service';

describe('StudentEnrollmentService', () => {
  let service: ITIStudentEnrollmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIStudentEnrollmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
