import { TestBed } from '@angular/core/testing';

import { SsoidUpdateService } from './ssoid-update.service';

describe('SsoidUpdateService', () => {
  let service: SsoidUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SsoidUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
