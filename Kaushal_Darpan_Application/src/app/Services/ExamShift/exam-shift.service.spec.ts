import { TestBed } from '@angular/core/testing';

import { ExamShiftService } from './exam-shift.service';

describe('ExamShiftService', () => {
  let service: ExamShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamShiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
