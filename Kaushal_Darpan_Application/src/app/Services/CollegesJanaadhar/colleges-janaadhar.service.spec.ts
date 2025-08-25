import { TestBed } from '@angular/core/testing';

import { CollegesJanaadharService } from './colleges-janaadhar.service';

describe('CollegesJanaadharService', () => {
  let service: CollegesJanaadharService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegesJanaadharService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
