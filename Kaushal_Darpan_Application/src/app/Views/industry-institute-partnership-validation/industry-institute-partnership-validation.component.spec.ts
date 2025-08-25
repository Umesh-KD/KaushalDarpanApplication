import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryInstitutePartnershipValidationComponent } from './industry-institute-partnership-validation.component';

describe('IndustryInstitutePartnershipValidationComponent', () => {
  let component: IndustryInstitutePartnershipValidationComponent;
  let fixture: ComponentFixture<IndustryInstitutePartnershipValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndustryInstitutePartnershipValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndustryInstitutePartnershipValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
