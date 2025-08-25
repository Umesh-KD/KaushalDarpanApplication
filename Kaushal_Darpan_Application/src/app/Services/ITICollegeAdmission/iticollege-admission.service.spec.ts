import { TestBed } from '@angular/core/testing';

import { ITICollegeAdmissionService } from './iticollege-admission.service';

describe('ITICollegeAdmissionService', () => {
  let service: ITICollegeAdmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITICollegeAdmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
