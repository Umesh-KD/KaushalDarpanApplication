import { TestBed } from '@angular/core/testing';

import { ITITeacherDashboardService } from './iti-teacher-dashboard.service';

describe('ITITeacherDashboardService', () => {
  let service: ITITeacherDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITITeacherDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
