import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndustryInstitutePartnershipMasterComponent } from './add-industry-institute-partnership-master.component';

describe('AddIndustryInstitutePartnershipMasterComponent', () => {
  let component: AddIndustryInstitutePartnershipMasterComponent;
  let fixture: ComponentFixture<AddIndustryInstitutePartnershipMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddIndustryInstitutePartnershipMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIndustryInstitutePartnershipMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
