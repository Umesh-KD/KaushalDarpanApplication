import { TestBed } from '@angular/core/testing';

import { CustomizeReportService } from './customize-report.service';

describe('CustomizeReportService', () => {
  let service: CustomizeReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomizeReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
