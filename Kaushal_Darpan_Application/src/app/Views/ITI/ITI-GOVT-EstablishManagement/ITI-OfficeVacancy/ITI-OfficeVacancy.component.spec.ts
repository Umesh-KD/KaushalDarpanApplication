import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIOfficeVacancyComponent } from './ITI-OfficeVacancy.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: ITIOfficeVacancyComponent;
  let fixture: ComponentFixture<ITIOfficeVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIOfficeVacancyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIOfficeVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
