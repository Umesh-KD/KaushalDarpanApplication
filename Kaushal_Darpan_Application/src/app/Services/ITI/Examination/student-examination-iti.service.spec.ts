import { TestBed } from '@angular/core/testing';

import { StudentExaminationITIService } from './student-examination-iti.service';

describe('StudentExaminationITIService', () => {
  let service: StudentExaminationITIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentExaminationITIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
