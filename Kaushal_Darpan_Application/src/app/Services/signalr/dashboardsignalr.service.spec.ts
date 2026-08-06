import { TestBed } from '@angular/core/testing';
import { DashboardSignalrService } from './dashboardsignalr.service';

describe('DashboardSignalrService', () => {
  let service: DashboardSignalrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardSignalrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
