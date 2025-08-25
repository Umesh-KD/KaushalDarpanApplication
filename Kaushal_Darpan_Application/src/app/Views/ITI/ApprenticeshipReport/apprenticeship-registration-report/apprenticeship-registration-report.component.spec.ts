import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenticeshipRegistrationReport } from './apprenticeship-registration-report.component';

describe('ApprenticeshipRegistrationReport', () => {
  let component: ApprenticeshipRegistrationReport;
  let fixture: ComponentFixture<ApprenticeshipRegistrationReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprenticeshipRegistrationReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprenticeshipRegistrationReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
