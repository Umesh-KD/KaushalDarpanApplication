import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenticeshipDirectorNCVTDashboardComponent } from './iti-ApprenticeshipDirectorNCVTDashboard.component';

describe('ApprenticeshipDirectorNCVTDashboardComponent', () => {
  let component: ApprenticeshipDirectorNCVTDashboardComponent;
  let fixture: ComponentFixture<ApprenticeshipDirectorNCVTDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprenticeshipDirectorNCVTDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprenticeshipDirectorNCVTDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
