import { TestBed } from '@angular/core/testing';

import { ITIBudgetCreateService } from './itibudget-create.service';

describe('ITIBudgetCreateService', () => {
  let service: ITIBudgetCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIBudgetCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
