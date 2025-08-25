import { TestBed } from '@angular/core/testing';

import { ReservationRosterService } from './reservation-roster.service';

describe('ReservationRosterService', () => {
  let service: ReservationRosterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationRosterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
