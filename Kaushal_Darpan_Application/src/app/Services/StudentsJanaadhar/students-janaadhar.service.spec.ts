import { TestBed } from '@angular/core/testing';

import { StudentsJanaadharService } from './students-janaadhar.service';

describe('StudentsJanaadharService', () => {
  let service: StudentsJanaadharService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentsJanaadharService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
