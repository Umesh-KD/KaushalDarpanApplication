import { TestBed } from '@angular/core/testing';

import { AssignRoleRightsService } from './assign-role-rights.service';

describe('AssignRoleRightsService', () => {
  let service: AssignRoleRightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignRoleRightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
