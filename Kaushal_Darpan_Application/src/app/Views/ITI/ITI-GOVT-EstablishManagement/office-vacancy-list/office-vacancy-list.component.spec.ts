import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeVacancyListComponent } from './office-vacancy-list.component';

describe('OfficeVacancyListComponent', () => {
  let component: OfficeVacancyListComponent;
  let fixture: ComponentFixture<OfficeVacancyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeVacancyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeVacancyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
