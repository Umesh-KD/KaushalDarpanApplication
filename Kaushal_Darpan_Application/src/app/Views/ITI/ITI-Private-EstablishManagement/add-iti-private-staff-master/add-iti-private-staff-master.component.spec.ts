import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItiPrivateStaffMasterComponent } from './add-iti-private-staff-master.component';

describe('AddItiPrivateStaffMasterComponent', () => {
  let component: AddItiPrivateStaffMasterComponent;
  let fixture: ComponentFixture<AddItiPrivateStaffMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddItiPrivateStaffMasterComponent]
    });
    fixture = TestBed.createComponent(AddItiPrivateStaffMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
