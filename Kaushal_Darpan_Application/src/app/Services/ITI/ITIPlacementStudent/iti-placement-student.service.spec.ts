import { TestBed } from '@angular/core/testing';

import { ITIPlacementStudentService } from './iti-placement-student.service';

describe('ITIPlacementStudentService', () => {
  let service: ITIPlacementStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIPlacementStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
