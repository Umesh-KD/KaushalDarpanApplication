import { TestBed } from '@angular/core/testing';

import { SeatIntakesService } from './seat-intakes.service';

describe('SeatIntakesService', () => {
  let service: SeatIntakesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeatIntakesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
