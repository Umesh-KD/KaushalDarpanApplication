import { TestBed } from '@angular/core/testing';

import { AbcIdStudentDetailsService } from './abc-id-student-details.service';

describe('AbcIdStudentDetailsService', () => {
  let service: AbcIdStudentDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbcIdStudentDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
