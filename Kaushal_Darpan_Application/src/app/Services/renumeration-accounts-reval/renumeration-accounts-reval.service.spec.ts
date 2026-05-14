import { TestBed } from '@angular/core/testing';

import { RenumerationAccountsRevalService } from './renumeration-accounts-reval.service';

describe('RenumerationAccountsRevalService', () => {
  let service: RenumerationAccountsRevalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenumerationAccountsRevalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
