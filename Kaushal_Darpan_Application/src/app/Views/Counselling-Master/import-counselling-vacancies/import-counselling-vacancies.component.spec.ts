import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCounsellingVacanciesComponent } from './import-counselling-vacancies.component';

describe('ImportCounsellingVacanciesComponent', () => {
  let component: ImportCounsellingVacanciesComponent;
  let fixture: ComponentFixture<ImportCounsellingVacanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportCounsellingVacanciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportCounsellingVacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
