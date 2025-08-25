import { TestBed } from '@angular/core/testing';

import { ITIsService } from './itis.service';

describe('ITIsService', () => {
  let service: ITIsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
