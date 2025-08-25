import { TestBed } from '@angular/core/testing';

import { SecretaryJDDashboardService } from './secretary-jd-dashboard.service';

describe('SecretaryJDDashboardService', () => {
  let service: SecretaryJDDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecretaryJDDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
