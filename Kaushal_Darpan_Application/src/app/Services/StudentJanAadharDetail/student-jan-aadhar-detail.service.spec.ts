import { TestBed } from '@angular/core/testing';

import { StudentJanAadharDetailService } from './student-jan-aadhar-detail.service';

describe('StudentJanAadharDetailService', () => {
  let service: StudentJanAadharDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentJanAadharDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
