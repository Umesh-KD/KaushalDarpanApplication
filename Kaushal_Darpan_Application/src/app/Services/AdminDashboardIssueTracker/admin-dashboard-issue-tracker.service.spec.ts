import { TestBed } from '@angular/core/testing';

import { AdminDashboardIssueTrackerService } from './admin-dashboard-issue-tracker.service';

describe('AdminDashboardIssueTrackerService', () => {
  let service: AdminDashboardIssueTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDashboardIssueTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
