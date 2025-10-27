import { TestBed } from '@angular/core/testing';

import { DTEEquipmentsMasterService } from './dteequipments-master.service';

describe('DTEEquipmentsMasterService', () => {
  let service: DTEEquipmentsMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DTEEquipmentsMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
