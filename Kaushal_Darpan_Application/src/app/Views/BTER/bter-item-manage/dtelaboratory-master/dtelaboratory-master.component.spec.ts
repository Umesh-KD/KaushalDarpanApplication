import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DteLaboratoryMasterComponent } from './dtelaboratory-master.component';

describe('LaboratoryMasterComponent', () => {
  let component: DteLaboratoryMasterComponent;
  let fixture: ComponentFixture<DteEquipmentsMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DteLaboratoryMasterComponent]
    });
    fixture = TestBed.createComponent(DteLaboratoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
