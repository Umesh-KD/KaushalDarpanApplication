import { TestBed } from '@angular/core/testing';

import { DetainedStudentsService } from './detained-students.service';

describe('DetainedStudentsService', () => {
  let service: DetainedStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetainedStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
