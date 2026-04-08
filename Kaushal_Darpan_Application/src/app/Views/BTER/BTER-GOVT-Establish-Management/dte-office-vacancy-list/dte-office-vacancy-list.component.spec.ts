import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEOfficeVacancyListComponent } from './dte-office-vacancy-list.component';

describe('DTEOfficeVacancyListComponent', () => {
  let component: DTEOfficeVacancyListComponent;
  let fixture: ComponentFixture<DTEOfficeVacancyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DTEOfficeVacancyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DTEOfficeVacancyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
