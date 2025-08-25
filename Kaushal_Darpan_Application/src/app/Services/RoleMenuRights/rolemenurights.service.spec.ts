import { TestBed } from '@angular/core/testing';

import { RolemenurightsService } from './rolemenurights.service';

describe('RolemenurightsService', () => {
  let service: RolemenurightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolemenurightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
