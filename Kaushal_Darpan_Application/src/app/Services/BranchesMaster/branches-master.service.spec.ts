import { TestBed } from '@angular/core/testing';

import { BranchesMasterService } from './branches-master.service';

describe('BranchesMasterService', () => {
  let service: BranchesMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchesMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
