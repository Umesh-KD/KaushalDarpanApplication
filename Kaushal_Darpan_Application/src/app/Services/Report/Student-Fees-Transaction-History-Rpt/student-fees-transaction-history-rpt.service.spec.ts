import { TestBed } from '@angular/core/testing';

import { StudentFeesTransactionHistoryRptService } from './student-fees-transaction-history-rpt.service';

describe('StudentFeesTransactionHistoryRptService', () => {
  let service: StudentFeesTransactionHistoryRptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentFeesTransactionHistoryRptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
