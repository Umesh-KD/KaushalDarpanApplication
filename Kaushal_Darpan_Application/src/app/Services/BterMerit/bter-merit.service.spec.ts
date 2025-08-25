import { TestBed } from '@angular/core/testing';

import { BterMeritService } from './bter-merit.service';

describe('BterMeritService', () => {
  let service: BterMeritService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BterMeritService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
