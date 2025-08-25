import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTradeEquipmentsMappingComponent } from './adddte-trade-equipments-mapping.component';

describe('AddTradeEquipmentsMappingComponent', () => {
  let component: AddTradeEquipmentsMappingComponent;
  let fixture: ComponentFixture<AddTradeEquipmentsMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTradeEquipmentsMappingComponent]
    });
    fixture = TestBed.createComponent(AddTradeEquipmentsMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
