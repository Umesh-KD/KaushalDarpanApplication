import { TestBed } from '@angular/core/testing';

import { ITIAdminUserService } from './itiadmin-user.service';

describe('ITIAdminUserService', () => {
  let service: ITIAdminUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIAdminUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
