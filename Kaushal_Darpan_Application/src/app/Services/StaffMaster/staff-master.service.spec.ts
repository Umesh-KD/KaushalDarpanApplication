import { TestBed } from '@angular/core/testing';

import { StaffMasterService } from './staff-master.service';

describe('StaffMasterService', () => {
  let service: StaffMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
