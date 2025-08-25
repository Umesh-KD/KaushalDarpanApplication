import { TestBed } from '@angular/core/testing';

import { ITIInventoryManagementDashboardService } from './itiinventory-management-dashboard.service';

describe('ITIInventoryManagementDashboardService', () => {
  let service: ITIInventoryManagementDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIInventoryManagementDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
