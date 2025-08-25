import { TestBed } from '@angular/core/testing';

import { ITIInvigilatorService } from './itiinvigilator.service';

describe('ITIInvigilatorService', () => {
  let service: ITIInvigilatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIInvigilatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
