import { TestBed } from '@angular/core/testing';

import { ExaminerReportService } from './examiner-report.service';

describe('ExaminerReportService', () => {
  let service: ExaminerReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExaminerReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
