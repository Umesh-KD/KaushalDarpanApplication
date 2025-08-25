import { TestBed } from '@angular/core/testing';

import { AllotmentConfigurationService } from './allotment-configuration.service';

describe('AllotmentConfigurationService', () => {
  let service: AllotmentConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllotmentConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
