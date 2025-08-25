import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeEquipmentsMappingListComponent } from './dtetrade-equipments-mapping-list.component';

describe('TradeEquipmentsMappingListComponent', () => {
  let component: TradeEquipmentsMappingListComponent;
  let fixture: ComponentFixture<TradeEquipmentsMappingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeEquipmentsMappingListComponent]
    });
    fixture = TestBed.createComponent(TradeEquipmentsMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
