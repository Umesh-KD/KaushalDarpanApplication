import { TestBed } from '@angular/core/testing';

import { BTEREstablishManagementService } from './bter-establish-management.service';

describe('BTEREstablishManagementService', () => {
  let service: BTEREstablishManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BTEREstablishManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
