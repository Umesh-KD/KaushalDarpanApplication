import { TestBed } from '@angular/core/testing';

import { ITIAdminDashboardServiceService } from './iti-admin-dashboard-service.service';

describe('ITIAdminDashboardServiceService', () => {
  let service: ITIAdminDashboardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIAdminDashboardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
