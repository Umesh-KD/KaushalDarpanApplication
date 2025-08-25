import { TestBed } from '@angular/core/testing';
import { CopyCheckerDashboardService } from './copy-checker-dashboard.service';

describe('CopyCheckerDashboardService', () => {
  let service: CopyCheckerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopyCheckerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
