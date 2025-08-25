import { TestBed } from '@angular/core/testing';

import { ITI_NCVTService } from './iti-nvct.service';

describe('ITI_NCVTService', () => {
  let service: ITI_NCVTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITI_NCVTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
