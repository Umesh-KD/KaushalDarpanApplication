import { TestBed } from '@angular/core/testing';
import { DteInventoryManagementDashboardService } from './dteinventory-management-dashboard.service';


describe('ITIInventoryManagementDashboardService', () => {
  let service: DteInventoryManagementDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DteInventoryManagementDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
