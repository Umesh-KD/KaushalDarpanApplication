import { TestBed } from '@angular/core/testing';

import { TradeEquipmentsMappingService } from './trade-equipments-mapping.service';

describe('TradeEquipmentsMappingService', () => {
  let service: TradeEquipmentsMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeEquipmentsMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
