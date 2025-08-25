import { TestBed } from '@angular/core/testing';

import { ApprenticeReportServiceService } from './apprentice-report-service.service';

describe('ApprenticeReportServiceService', () => {
  let service: ApprenticeReportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprenticeReportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
