import { TestBed } from '@angular/core/testing';

import { ItemsMasterService } from './items-master.service';

describe('ItemsMasterService', () => {
  let service: ItemsMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
