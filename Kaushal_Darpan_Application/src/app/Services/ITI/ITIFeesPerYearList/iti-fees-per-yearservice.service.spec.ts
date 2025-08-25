import { TestBed } from '@angular/core/testing';

import { ItiFeesPerYearserviceService } from './iti-fees-per-yearservice.service';

describe('ItiFeesPerYearserviceService', () => {
  let service: ItiFeesPerYearserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiFeesPerYearserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
