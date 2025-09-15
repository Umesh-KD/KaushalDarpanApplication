import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeVacancyComponent } from './OfficeVacancy.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: OfficeVacancyComponent;
  let fixture: ComponentFixture<OfficeVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficeVacancyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
