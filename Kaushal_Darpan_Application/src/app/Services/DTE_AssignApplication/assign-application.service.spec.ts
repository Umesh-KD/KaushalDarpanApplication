import { TestBed } from '@angular/core/testing';

import { AssignApplicationService } from './assign-application.service';

describe('AssignApplicationService', () => {
  let service: AssignApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
