import { TestBed } from '@angular/core/testing';

import { TheoryMarksService } from './theory-marks.service';

describe('TheoryMarksService', () => {
  let service: TheoryMarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheoryMarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
