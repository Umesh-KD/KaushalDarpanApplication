import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIIndustryInstitutePartnershipValidationComponent } from './ITI-Industry-institute-partnership-validation.component';

describe('IndustryInstitutePartnershipValidationComponent', () => {
  let component: ITIIndustryInstitutePartnershipValidationComponent;
  let fixture: ComponentFixture<ITIIndustryInstitutePartnershipValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIIndustryInstitutePartnershipValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIIndustryInstitutePartnershipValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
