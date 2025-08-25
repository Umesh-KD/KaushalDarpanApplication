import { TestBed } from '@angular/core/testing';

import { PlacementVerifiedStudentTPOService } from './placement-verified-student-tpo.service';

describe('PlacementVerifiedStudentTPOService', () => {
  let service: PlacementVerifiedStudentTPOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementVerifiedStudentTPOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
