import { TestBed } from '@angular/core/testing';

import { RevaluationService } from './revaluation.service';

describe('RevaluationService', () => {
  let service: RevaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
