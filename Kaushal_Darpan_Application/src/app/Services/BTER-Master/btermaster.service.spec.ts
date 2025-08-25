import { TestBed } from '@angular/core/testing';

import { BTERMasterService } from './btermaster.service';

describe('BTERMasterService', () => {
  let service: BTERMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BTERMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
