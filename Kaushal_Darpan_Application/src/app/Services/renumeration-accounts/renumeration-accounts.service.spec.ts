import { TestBed } from '@angular/core/testing';

import { RenumerationAccountsService } from './renumeration-accounts.service';

describe('RenumerationAccountsService', () => {
  let service: RenumerationAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenumerationAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
