import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffMasterComponent } from './add-staff-master.component';

describe('AddStaffMasterComponent', () => {
  let component: AddStaffMasterComponent;
  let fixture: ComponentFixture<AddStaffMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStaffMasterComponent]
    });
    fixture = TestBed.createComponent(AddStaffMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
