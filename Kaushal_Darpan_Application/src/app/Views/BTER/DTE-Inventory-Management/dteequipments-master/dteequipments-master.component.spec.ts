import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DteEquipmentsMasterComponent } from './dteequipments-master.component';

describe('EquipmentsMasterComponent', () => {
  let component: DteEquipmentsMasterComponent;
  let fixture: ComponentFixture<DteEquipmentsMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DteEquipmentsMasterComponent]
    });
    fixture = TestBed.createComponent(DteEquipmentsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
