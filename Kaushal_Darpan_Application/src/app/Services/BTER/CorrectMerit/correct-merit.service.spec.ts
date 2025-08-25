import { TestBed } from '@angular/core/testing';

import { CorrectMeritService } from './correct-merit.service';

describe('CorrectMeritService', () => {
  let service: CorrectMeritService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrectMeritService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
