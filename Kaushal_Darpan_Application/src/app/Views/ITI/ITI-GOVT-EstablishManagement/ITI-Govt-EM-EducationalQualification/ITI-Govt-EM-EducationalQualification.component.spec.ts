import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtEMEducationalQualificationComponent } from './ITI-Govt-EM-EducationalQualification.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: ITIGovtEMEducationalQualificationComponent;
  let fixture: ComponentFixture<ITIGovtEMEducationalQualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtEMEducationalQualificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtEMEducationalQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
