import { TestBed } from '@angular/core/testing';

import { BTEREMStaffServiceDetailsService } from './bter-em-staff-service-details.service';

describe('BTEREMStaffServiceDetailsService', () => {
  let service: BTEREMStaffServiceDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BTEREMStaffServiceDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
