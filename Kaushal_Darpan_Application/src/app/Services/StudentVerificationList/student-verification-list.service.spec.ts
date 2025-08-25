import { TestBed } from '@angular/core/testing';

import { StudentVerificationListService } from './student-verification-list.service';

describe('StudentVerificationListService', () => {
  let service: StudentVerificationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentVerificationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
