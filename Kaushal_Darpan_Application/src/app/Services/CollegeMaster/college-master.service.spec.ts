import { TestBed } from '@angular/core/testing';

import { CollegeMasterService } from './college-master.service';

describe('CollegeMasterService', () => {
  let service: CollegeMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegeMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
