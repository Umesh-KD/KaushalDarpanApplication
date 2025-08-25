import { TestBed } from '@angular/core/testing';

import { ITICollegeProfileService } from './iticollege-profile.service';

describe('ITICollegeProfileService', () => {
  let service: ITICollegeProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITICollegeProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
