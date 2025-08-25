import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtEMStaffProfileComponent } from './ITI-Govt-EM-StaffProfile.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: ITIGovtEMStaffProfileComponent;
  let fixture: ComponentFixture<ITIGovtEMStaffProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtEMStaffProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtEMStaffProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
