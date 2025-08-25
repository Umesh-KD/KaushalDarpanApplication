import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenticeshipRegistrationReportList } from './apprenticeship-registration-report-list.component';

describe('ApprenticeshipRegistrationReportList', () => {
  let component: ApprenticeshipRegistrationReportList;
  let fixture: ComponentFixture<ApprenticeshipRegistrationReportList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprenticeshipRegistrationReportList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprenticeshipRegistrationReportList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
