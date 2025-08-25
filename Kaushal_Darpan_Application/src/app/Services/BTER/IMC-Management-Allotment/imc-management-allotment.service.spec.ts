import { TestBed } from '@angular/core/testing';

import { IMCManagementAllotmentService } from './imc-management-allotment.service';

describe('IMCManagementAllotmentService', () => {
  let service: IMCManagementAllotmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IMCManagementAllotmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
