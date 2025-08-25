import { TestBed } from '@angular/core/testing';

import { StudentsJoiningStatusMarksService } from './students-joining-status-marks.service';

describe('StudentsJoiningStatusMarksService', () => {
  let service: StudentsJoiningStatusMarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentsJoiningStatusMarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
