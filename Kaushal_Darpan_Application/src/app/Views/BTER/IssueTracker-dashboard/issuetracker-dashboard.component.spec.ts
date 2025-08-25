import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuetrackerDashboardComponent1 } from './issuetracker-dashboard.component';

describe('IssuetrackerDashboardComponent', () => {
  let component: IssuetrackerDashboardComponent1;
  let fixture: ComponentFixture<IssuetrackerDashboardComponent1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssuetrackerDashboardComponent1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuetrackerDashboardComponent1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
