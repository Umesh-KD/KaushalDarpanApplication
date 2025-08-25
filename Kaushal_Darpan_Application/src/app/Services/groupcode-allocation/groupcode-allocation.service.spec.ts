import { TestBed } from '@angular/core/testing';

import { GroupcodeAllocationService } from './groupcode-allocation.service';

describe('GroupcodeAllocationService', () => {
  let service: GroupcodeAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupcodeAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
