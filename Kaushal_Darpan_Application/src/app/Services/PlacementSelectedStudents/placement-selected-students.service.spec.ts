import { TestBed } from '@angular/core/testing';

import { PlacementSelectedStudentsService } from './placement-selected-students.service';

describe('PlacementSelectedStudentsService', () => {
  let service: PlacementSelectedStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementSelectedStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
