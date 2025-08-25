import { TestBed } from '@angular/core/testing';

import { ITIApprenticeshipService } from './iti-apprenticeship.service';

describe('ITIInspectionService', () => {
  let service: ITIApprenticeshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIApprenticeshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
