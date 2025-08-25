import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIGovtEMZonalOfficeMasterComponent } from './ITI-Govt-EM-ZonalOfficeMaster.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: ITIGovtEMZonalOfficeMasterComponent;
  let fixture: ComponentFixture<ITIGovtEMZonalOfficeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIGovtEMZonalOfficeMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIGovtEMZonalOfficeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
