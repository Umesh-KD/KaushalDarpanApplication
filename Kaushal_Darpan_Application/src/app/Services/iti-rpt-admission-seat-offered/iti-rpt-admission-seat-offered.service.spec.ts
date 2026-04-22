import { TestBed } from '@angular/core/testing';

import { ItiRptAdmissionSeatOfferedService } from './iti-rpt-admission-seat-offered.service';

describe('ItiRptAdmissionSeatOfferedService', () => {
  let service: ItiRptAdmissionSeatOfferedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiRptAdmissionSeatOfferedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
