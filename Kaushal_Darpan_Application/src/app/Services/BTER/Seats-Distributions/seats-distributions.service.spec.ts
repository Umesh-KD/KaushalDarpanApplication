import { TestBed } from '@angular/core/testing';

import { BTERSeatsDistributionsService } from './seats-distributions.service';

describe('ITISeatsDistributionsService', () => {
  let service: BTERSeatsDistributionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BTERSeatsDistributionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
