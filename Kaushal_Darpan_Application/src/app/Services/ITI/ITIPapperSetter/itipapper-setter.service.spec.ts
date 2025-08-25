import { TestBed } from '@angular/core/testing';

import { ITIPapperSetterService } from './itipapper-setter.service';

describe('ITIPapperSetterService', () => {
  let service: ITIPapperSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIPapperSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
