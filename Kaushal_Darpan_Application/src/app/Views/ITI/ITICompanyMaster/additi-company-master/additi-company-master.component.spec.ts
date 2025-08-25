import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItiCompanyMasterComponent } from './additi-company-master.component';

describe('AddCompanyMasterComponent', () => {
  let component: AddItiCompanyMasterComponent;
  let fixture: ComponentFixture<AddItiCompanyMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddItiCompanyMasterComponent]
    });
    fixture = TestBed.createComponent(AddItiCompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
