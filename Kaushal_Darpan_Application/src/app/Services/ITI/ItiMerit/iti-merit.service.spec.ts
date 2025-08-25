import { TestBed } from '@angular/core/testing';

import { ItiMeritService } from './iti-merit.service';

describe('ItiMaritService', () => {
  let service: ItiMeritService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiMeritService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
