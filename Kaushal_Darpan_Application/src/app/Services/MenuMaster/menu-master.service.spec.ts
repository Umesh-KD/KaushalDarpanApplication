import { TestBed } from '@angular/core/testing';

import { MenuMasterService } from './menu-master.service';

describe('MenuMasterService', () => {
  let service: MenuMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
