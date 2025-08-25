import { TestBed } from '@angular/core/testing';

import { RenumerationJdService } from './renumeration-jd.service';

describe('RenumerationJdService', () => {
  let service: RenumerationJdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenumerationJdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
