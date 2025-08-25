import { TestBed } from '@angular/core/testing';

import { ITIPlacementShortlistedStudentsService } from './itiplacement-shortlisted-students.service';

describe('PlacementShortlistedStudentsService', () => {
  let service: ITIPlacementShortlistedStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIPlacementShortlistedStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
