import { TestBed } from '@angular/core/testing';

import { ITIPrincipalDashboardServiceService } from './iti-principal-dashboard-service.service';

describe('ITIAdminDashboardServiceService', () => {
  let service: ITIPrincipalDashboardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIPrincipalDashboardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
