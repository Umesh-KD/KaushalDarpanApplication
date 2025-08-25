import { TestBed } from '@angular/core/testing';

import { ITIPlacementSelectedStudentsService } from './iti-placement-selected-students.service';

describe('ITIPlacementSelectedStudentsService', () => {
  let service: ITIPlacementSelectedStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIPlacementSelectedStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
