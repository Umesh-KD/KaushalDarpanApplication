import { TestBed } from '@angular/core/testing';

import { PlacementStudentService } from './placement-student.service';

describe('PlacementStudentService', () => {
  let service: PlacementStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
