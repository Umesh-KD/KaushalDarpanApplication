import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIAddIndustryInstitutePartnershipMasterComponent } from './iti-add-industry-institute-partnership-master.component';

describe('AddIndustryInstitutePartnershipMasterComponent', () => {
  let component: ITIAddIndustryInstitutePartnershipMasterComponent;
  let fixture: ComponentFixture<ITIAddIndustryInstitutePartnershipMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIAddIndustryInstitutePartnershipMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIAddIndustryInstitutePartnershipMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
