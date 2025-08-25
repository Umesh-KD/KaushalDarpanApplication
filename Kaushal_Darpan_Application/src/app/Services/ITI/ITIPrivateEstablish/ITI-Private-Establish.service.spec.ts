import { TestBed } from '@angular/core/testing';

import { ITIPrivateEstablishService } from './ITI-Private-Establish.service';

describe('ITIPrivateEstablishService', () => {
  let service: ITIPrivateEstablishService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIPrivateEstablishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
