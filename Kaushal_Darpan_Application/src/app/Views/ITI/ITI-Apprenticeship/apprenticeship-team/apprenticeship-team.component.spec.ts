import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenticeshipTeamComponent } from './apprenticeship-team.component';

describe('ApprenticeshipTeamComponent', () => {
  let component: ApprenticeshipTeamComponent;
  let fixture: ComponentFixture<ApprenticeshipTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprenticeshipTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprenticeshipTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
