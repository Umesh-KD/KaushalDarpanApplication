import { TestBed } from '@angular/core/testing';

import { HiringRoleMasterService } from './hiring-role-master.service';

describe('HiringRoleMasterService', () => {
  let service: HiringRoleMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiringRoleMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
