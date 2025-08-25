import { TestBed } from '@angular/core/testing';

import { IssuedItemsService } from './issued-items.service';

describe('IssuedItemsService', () => {
  let service: IssuedItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssuedItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
