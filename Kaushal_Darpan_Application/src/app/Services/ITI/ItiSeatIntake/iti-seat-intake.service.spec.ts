import { TestBed } from '@angular/core/testing';

import { ItiSeatIntakeService } from './iti-seat-intake.service';

describe('ItiSeatIntakeService', () => {
  let service: ItiSeatIntakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiSeatIntakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
