import { TestBed } from '@angular/core/testing';

import { CenterAllocationService } from './center-allocation.service';

describe('CenterAllocationService', () => {
  let service: CenterAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
