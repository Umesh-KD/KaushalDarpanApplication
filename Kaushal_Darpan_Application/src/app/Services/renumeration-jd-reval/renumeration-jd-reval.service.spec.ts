import { TestBed } from '@angular/core/testing';

import { RenumerationJdRevalService } from './renumeration-jd-reval.service';

describe('RenumerationJdRevalService', () => {
  let service: RenumerationJdRevalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenumerationJdRevalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
