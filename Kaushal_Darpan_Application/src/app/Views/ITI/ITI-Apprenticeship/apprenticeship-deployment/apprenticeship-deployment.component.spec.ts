import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenticeshipDeploymentComponent } from './apprenticeship-deployment.component';

describe('ApprenticeshipDeploymentComponent', () => {
  let component: ApprenticeshipDeploymentComponent;
  let fixture: ComponentFixture<ApprenticeshipDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprenticeshipDeploymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprenticeshipDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
