import { TestBed } from '@angular/core/testing';

import { InternalSlidingService } from './internal-sliding.service';

describe('InternalSlidingService', () => {
  let service: InternalSlidingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternalSlidingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
