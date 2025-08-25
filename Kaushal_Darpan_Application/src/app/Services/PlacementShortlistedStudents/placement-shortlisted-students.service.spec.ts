import { TestBed } from '@angular/core/testing';

import { PlacementShortlistedStudentsService } from './placement-shortlisted-students.service';

describe('PlacementShortlistedStudentsService', () => {
  let service: PlacementShortlistedStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementShortlistedStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
