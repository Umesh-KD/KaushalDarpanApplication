import { TestBed } from '@angular/core/testing';

import { ItemUnitMasterService } from './Itemunit-master.service';

describe('CategoriesMasterService', () => {
  let service: ItemUnitMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemUnitMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
