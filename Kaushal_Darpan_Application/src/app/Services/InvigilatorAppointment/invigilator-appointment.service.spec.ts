import { TestBed } from '@angular/core/testing';

import { InvigilatorAppointmentService } from './invigilator-appointment.service';

describe('InvigilatorAppointmentService', () => {
  let service: InvigilatorAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvigilatorAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
