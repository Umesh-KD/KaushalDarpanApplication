import { TestBed } from '@angular/core/testing';

import { RenumerationExaminerService } from './renumeration-examiner.service';

describe('RenumerationExaminerService', () => {
  let service: RenumerationExaminerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenumerationExaminerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
