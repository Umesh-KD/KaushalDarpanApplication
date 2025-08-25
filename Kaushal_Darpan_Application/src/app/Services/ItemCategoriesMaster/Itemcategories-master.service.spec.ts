import { TestBed } from '@angular/core/testing';

import { ItemCategoriesMasterService } from './Itemcategories-master.service';

describe('CategoriesMasterService', () => {
  let service: ItemCategoriesMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemCategoriesMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
