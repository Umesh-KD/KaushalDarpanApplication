import { TestBed } from '@angular/core/testing';

import { UserMenuRightsService } from './user-menu-rights.service';

describe('UserMenuRightsService', () => {
  let service: UserMenuRightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMenuRightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
