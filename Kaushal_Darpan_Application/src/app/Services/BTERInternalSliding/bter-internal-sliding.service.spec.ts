import { TestBed } from '@angular/core/testing';

import { BterInternalSlidingService } from './bter-internal-sliding.service';

describe('BterInternalSlidingService', () => {
  let service: BterInternalSlidingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BterInternalSlidingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
