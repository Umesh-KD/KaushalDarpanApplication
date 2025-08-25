import { TestBed } from '@angular/core/testing';

import { DteItemsMasterService } from './dteitems-master.service';

describe('ItemsMasterService', () => {
  let service: DteItemsMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DteItemsMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
