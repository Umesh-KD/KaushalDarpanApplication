import { TestBed } from '@angular/core/testing';

import { ItiApplicationService } from './iti-application.service';

describe('ItiApplicationService', () => {
  let service: ItiApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
