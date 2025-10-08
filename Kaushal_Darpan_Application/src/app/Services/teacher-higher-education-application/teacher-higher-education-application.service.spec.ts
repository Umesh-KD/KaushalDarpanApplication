import { TestBed } from '@angular/core/testing';

import { TeacherHigherEducationApplicationService } from './teacher-higher-education-application.service';

describe('StudentEnrollmentService', () => {
  let service: TeacherHigherEducationApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherHigherEducationApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
