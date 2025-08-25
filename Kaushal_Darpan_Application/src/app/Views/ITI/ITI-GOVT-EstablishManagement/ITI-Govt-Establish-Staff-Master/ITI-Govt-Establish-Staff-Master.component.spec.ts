import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtEstablishStaffMasterComponent } from './ITI-Govt-Establish-Staff-Master.component';

describe('ITIGovtEstablishStaffMasterComponent', () => {
  let component: ITIGovtEstablishStaffMasterComponent;
  let fixture: ComponentFixture<ITIGovtEstablishStaffMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIGovtEstablishStaffMasterComponent]
    });
    fixture = TestBed.createComponent(ITIGovtEstablishStaffMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
