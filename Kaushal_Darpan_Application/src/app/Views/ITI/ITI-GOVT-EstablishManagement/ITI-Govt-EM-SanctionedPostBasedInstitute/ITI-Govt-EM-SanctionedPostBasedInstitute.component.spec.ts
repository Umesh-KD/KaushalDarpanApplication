import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtEMSanctionedPostBasedInstituteComponent } from './ITI-Govt-EM-SanctionedPostBasedInstitute.component';

describe('ITIGovtEMSanctionedPostBasedInstituteComponent', () => {
  let component: ITIGovtEMSanctionedPostBasedInstituteComponent;
  let fixture: ComponentFixture<ITIGovtEMSanctionedPostBasedInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtEMSanctionedPostBasedInstituteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtEMSanctionedPostBasedInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
