import { TestBed } from '@angular/core/testing';

import { CenterObserverService } from './center-observer.service';

describe('CenterObserverService', () => {
  let service: CenterObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
