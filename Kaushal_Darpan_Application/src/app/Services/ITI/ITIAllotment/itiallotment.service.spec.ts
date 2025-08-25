import { TestBed } from '@angular/core/testing';

import { ITIAllotmentService } from './itiallotment.service';

describe('ITIAllotmentService', () => {
  let service: ITIAllotmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIAllotmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
