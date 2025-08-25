import { TestBed } from '@angular/core/testing';

import { PreExamStudentExaminationService } from './pre-exam-student-examination.service';

describe('PreExamStudentExaminationService', () => {
  let service: PreExamStudentExaminationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreExamStudentExaminationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
