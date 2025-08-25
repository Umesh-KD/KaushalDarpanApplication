import { TestBed } from '@angular/core/testing';

import { DTEDashboardServiceService } from './dte-dashboard-service.service';

describe('DTEDashboardServiceService', () => {
  let service: DTEDashboardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DTEDashboardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
