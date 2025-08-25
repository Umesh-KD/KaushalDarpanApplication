import { TestBed } from '@angular/core/testing';

import { SetExamAttendanceService } from './set-exam-attendance.service';

describe('SetExamAttendanceService', () => {
  let service: SetExamAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetExamAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
