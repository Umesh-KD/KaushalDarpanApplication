import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dashboardIssueTrackerComponent } from './dashboard-issue-tracker.component';

describe('DashboardComponent', () => {
  let component: dashboardIssueTrackerComponent;
  let fixture: ComponentFixture<dashboardIssueTrackerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [dashboardIssueTrackerComponent]
    });
    fixture = TestBed.createComponent(dashboardIssueTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
