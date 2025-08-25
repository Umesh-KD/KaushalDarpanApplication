import { TestBed } from '@angular/core/testing';
import { DteItemUnitMasterService } from './DTEItemunit-master.service';


describe('DteItemUnitMasterService', () => {
  let service: DteItemUnitMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DteItemUnitMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
