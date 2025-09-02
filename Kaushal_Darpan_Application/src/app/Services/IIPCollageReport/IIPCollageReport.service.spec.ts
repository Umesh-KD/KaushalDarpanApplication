import { TestBed } from '@angular/core/testing';

import { IIPCollegeReportService } from './IIPCollageReport.service';


describe('IIPCollegeReportService', () => {
  let service: IIPCollegeReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IIPCollegeReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
