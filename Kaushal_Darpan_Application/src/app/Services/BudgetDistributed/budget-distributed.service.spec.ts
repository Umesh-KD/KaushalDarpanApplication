import { TestBed } from '@angular/core/testing';

import { BudgetDistributedService } from './budget-distributed.service';

describe('BudgetDistributedService', () => {
  let service: BudgetDistributedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetDistributedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
