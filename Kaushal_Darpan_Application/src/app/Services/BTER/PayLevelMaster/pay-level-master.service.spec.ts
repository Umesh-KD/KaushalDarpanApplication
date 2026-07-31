import { TestBed } from '@angular/core/testing';

import { PayLevelMasterService } from './pay-level-master.service';

describe('PayLevelMasterService', () => {
  let service: PayLevelMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayLevelMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
