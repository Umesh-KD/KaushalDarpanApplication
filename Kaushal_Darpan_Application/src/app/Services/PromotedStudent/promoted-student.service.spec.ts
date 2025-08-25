import { TestBed } from '@angular/core/testing';

import { PromotedStudentService } from './promoted-student.service';

describe('PromotedStudentService', () => {
  let service: PromotedStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotedStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
