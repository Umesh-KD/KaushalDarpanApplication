import { TestBed } from '@angular/core/testing';

import { AnalyticDashboardService } from './analytic-dashboard.service';

describe('AnalyticDashboardService', () => {
  let service: AnalyticDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
