import { TestBed } from '@angular/core/testing';

import { AdminDashboardDataService } from './admin-dashboard-data.service';

describe('AdminDashboardDataService', () => {
  let service: AdminDashboardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDashboardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
