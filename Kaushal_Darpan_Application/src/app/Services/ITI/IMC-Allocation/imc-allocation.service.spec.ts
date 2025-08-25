import { TestBed } from '@angular/core/testing';

import { IMCAllocationService } from './imc-allocation.service';

describe('IMCAllocationService', () => {
  let service: IMCAllocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IMCAllocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
