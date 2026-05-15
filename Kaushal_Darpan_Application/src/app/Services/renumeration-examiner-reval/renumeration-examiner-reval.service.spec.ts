import { TestBed } from '@angular/core/testing';

import { RenumerationExaminerRevalService } from './renumeration-examiner-reval.service';

describe('RenumerationExaminerRevalService', () => {
  let service: RenumerationExaminerRevalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenumerationExaminerRevalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
