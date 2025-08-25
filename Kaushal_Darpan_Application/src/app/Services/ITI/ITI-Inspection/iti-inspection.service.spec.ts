import { TestBed } from '@angular/core/testing';

import { ITIInspectionService } from './iti-inspection.service';

describe('ITIInspectionService', () => {
  let service: ITIInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
