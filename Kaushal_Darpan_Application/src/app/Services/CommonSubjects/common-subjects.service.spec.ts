import { TestBed } from '@angular/core/testing';

import { CommonSubjectsService } from './common-subjects.service';

describe('CommonSubjectsService', () => {
  let service: CommonSubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonSubjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
