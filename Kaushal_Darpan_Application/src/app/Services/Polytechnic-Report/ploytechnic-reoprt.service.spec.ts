import { TestBed } from '@angular/core/testing';

import { PloytechnicReoprtService } from './ploytechnic-reoprt.service';

describe('PloytechnicReoprtService', () => {
  let service: PloytechnicReoprtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PloytechnicReoprtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
