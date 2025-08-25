import { TestBed } from '@angular/core/testing';

import { ItiStudentFeesTransactionHistoryService } from './iti-student-fees-transaction-history.service';

describe('ItiStudentFeesTransactionHistoryService', () => {
  let service: ItiStudentFeesTransactionHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiStudentFeesTransactionHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
