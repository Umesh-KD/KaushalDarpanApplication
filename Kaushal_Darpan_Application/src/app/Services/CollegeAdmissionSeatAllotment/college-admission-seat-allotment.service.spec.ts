import { TestBed } from '@angular/core/testing';

import { CollegeAdmissionSeatAllotmentService } from './college-admission-seat-allotment.service';

describe('CollegeAdmissionSeatAllotmentService', () => {
  let service: CollegeAdmissionSeatAllotmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegeAdmissionSeatAllotmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
