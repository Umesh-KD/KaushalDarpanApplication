import { TestBed } from '@angular/core/testing';

import { AllotmentStatusService } from './allotment-status.service';

describe('AllotmentStatusService', () => {
  let service: AllotmentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllotmentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
