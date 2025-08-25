import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestDteTradeEquipmentsMappingComponent } from './add-request-dte-trade-equipments-mapping.component';

describe('AddRequestDteTradeEquipmentsMappingComponent', () => {
  let component: AddRequestDteTradeEquipmentsMappingComponent;
  let fixture: ComponentFixture<AddRequestDteTradeEquipmentsMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRequestDteTradeEquipmentsMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRequestDteTradeEquipmentsMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
