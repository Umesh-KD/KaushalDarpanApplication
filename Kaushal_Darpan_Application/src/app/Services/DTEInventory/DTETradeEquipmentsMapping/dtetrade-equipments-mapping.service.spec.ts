import { TestBed } from '@angular/core/testing';

import { DteTradeEquipmentsMappingService } from './dtetrade-equipments-mapping.service';

describe('DteTradeEquipmentsMappingService', () => {
  let service: DteTradeEquipmentsMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DteTradeEquipmentsMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
