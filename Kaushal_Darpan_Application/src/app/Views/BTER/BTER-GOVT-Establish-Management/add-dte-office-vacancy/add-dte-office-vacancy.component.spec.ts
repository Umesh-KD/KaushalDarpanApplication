import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDTEOfficeVacancyComponent } from './add-dte-office-vacancy.component';

describe('AddDTEOfficeVacancyComponent', () => {
  let component: AddDTEOfficeVacancyComponent;
  let fixture: ComponentFixture<AddDTEOfficeVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDTEOfficeVacancyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDTEOfficeVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
