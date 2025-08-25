import { TestBed } from '@angular/core/testing';

import { ITISeatsDistributionsService } from './iti-seats-distributions.service';

describe('ITISeatsDistributionsService', () => {
  let service: ITISeatsDistributionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITISeatsDistributionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
