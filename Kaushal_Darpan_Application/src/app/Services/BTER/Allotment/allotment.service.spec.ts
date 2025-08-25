import { TestBed } from '@angular/core/testing';

import { BTERAllotmentService } from './allotment.service';

describe('ITIAllotmentService', () => {
  let service: BTERAllotmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BTERAllotmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
