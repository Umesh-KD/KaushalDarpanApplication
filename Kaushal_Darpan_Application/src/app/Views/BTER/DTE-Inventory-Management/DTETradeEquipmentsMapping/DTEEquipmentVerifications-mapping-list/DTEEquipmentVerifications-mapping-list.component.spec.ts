import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEEquipmentVerificationsMappingListComponent } from './DTEEquipmentVerifications-mapping-list.component';

describe('TradeEquipmentsMappingListComponent', () => {
  let component: DTEEquipmentVerificationsMappingListComponent;
  let fixture: ComponentFixture<DTEEquipmentVerificationsMappingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTEEquipmentVerificationsMappingListComponent]
    });
    fixture = TestBed.createComponent(DTEEquipmentVerificationsMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
