import { TestBed } from '@angular/core/testing';

import { ExamMasterService } from './exam-master.service';

describe('ExamMasterService', () => {
  let service: ExamMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
