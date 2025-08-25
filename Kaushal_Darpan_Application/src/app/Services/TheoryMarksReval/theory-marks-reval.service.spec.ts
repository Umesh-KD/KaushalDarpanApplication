import { TestBed } from '@angular/core/testing';

import { TheoryMarksRevalService } from './theory-marks-reval.service';

describe('TheoryMarksService', () => {
  let service: TheoryMarksRevalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheoryMarksRevalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
