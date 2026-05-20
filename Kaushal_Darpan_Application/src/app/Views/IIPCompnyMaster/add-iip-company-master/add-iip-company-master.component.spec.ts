import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIipCompanyMasterComponent } from './add-iip-company-master.component';

describe('AddIipCompanyMasterComponent', () => {
  let component: AddIipCompanyMasterComponent;
  let fixture: ComponentFixture<AddIipCompanyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIipCompanyMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIipCompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
