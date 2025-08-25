import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyMasterComponent } from './add-company-master.component';

describe('AddCompanyMasterComponent', () => {
  let component: AddCompanyMasterComponent;
  let fixture: ComponentFixture<AddCompanyMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCompanyMasterComponent]
    });
    fixture = TestBed.createComponent(AddCompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
