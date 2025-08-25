import { TestBed } from '@angular/core/testing';

import { ITINodalOfficerExminerReportService } from './ITINodalOfficerExminerReport.service';

describe('ITINodalOfficerExminerReportService', () => {
  let service: ITINodalOfficerExminerReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITINodalOfficerExminerReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
