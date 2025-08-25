import { TestBed } from '@angular/core/testing';

import { PreExamStudentService } from './pre-exam-student.service';

describe('PreExamStudentService', () => {
  let service: PreExamStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreExamStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
