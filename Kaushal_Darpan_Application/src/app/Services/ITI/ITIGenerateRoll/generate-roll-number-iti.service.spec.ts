import { TestBed } from '@angular/core/testing';

import { GenerateRollNumberITIService } from './generate-roll-number-iti.service';

describe('GenerateRollNumberITIService', () => {
  let service: GenerateRollNumberITIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateRollNumberITIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
