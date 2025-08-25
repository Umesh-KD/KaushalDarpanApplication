import { TestBed } from '@angular/core/testing';

import { DteIssuedItemsService } from './dteissued-items.service';

describe('IssuedItemsService', () => {
  let service: DteIssuedItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DteIssuedItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
