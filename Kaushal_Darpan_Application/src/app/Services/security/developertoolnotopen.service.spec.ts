import { TestBed } from '@angular/core/testing';

import { DevelopertoolnotopenService } from './developertoolnotopen.service';

describe('DevelopertoolnotopenService', () => {
  let service: DevelopertoolnotopenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevelopertoolnotopenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
