import { TestBed } from '@angular/core/testing';

import { DTEItemCategoriesMasterService } from './dteItemcategories-master.service';

describe('CategoriesMasterService', () => {
  let service: DTEItemCategoriesMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DTEItemCategoriesMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
