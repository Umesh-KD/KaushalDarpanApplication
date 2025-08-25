import { TestBed } from '@angular/core/testing';

import { ITICenterObserverService } from './iticenter-observer.service';

describe('ITICenterObserverService', () => {
  let service: ITICenterObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITICenterObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
