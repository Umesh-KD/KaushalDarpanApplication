import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtEMZonalOfficeITIPrincipalMasterComponent } from './ITI-Govt-EM-ZonalOfficeITIPrincipalMaster.component';

describe('ITIGovtEMZonalOfficeITIPrincipalMasterComponent', () => {
  let component: ITIGovtEMZonalOfficeITIPrincipalMasterComponent;
  let fixture: ComponentFixture<ITIGovtEMZonalOfficeITIPrincipalMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtEMZonalOfficeITIPrincipalMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtEMZonalOfficeITIPrincipalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
