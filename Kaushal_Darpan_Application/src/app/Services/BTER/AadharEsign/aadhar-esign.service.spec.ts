import { TestBed } from '@angular/core/testing';

import { AadharEsignService } from './aadhar-esign.service';

describe('AadharEsignService', () => {
  let service: AadharEsignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AadharEsignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
