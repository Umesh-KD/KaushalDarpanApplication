import { TestBed } from '@angular/core/testing';

import { DispatchRevalService } from './DispatchReval.service';

describe('DispatchRevalService', () => {
  let service: DispatchRevalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchRevalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
