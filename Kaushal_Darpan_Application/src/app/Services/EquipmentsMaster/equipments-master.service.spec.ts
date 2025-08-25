import { TestBed } from '@angular/core/testing';

import { EquipmentsMasterService } from './equipments-master.service';

describe('EquipmentsMasterService', () => {
  let service: EquipmentsMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentsMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
