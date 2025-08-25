import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTrackerDashboardComponent } from './issue-tracker-dashboard.component';

describe('IssueTrackerDashboardComponent', () => {
  let component: IssueTrackerDashboardComponent;
  let fixture: ComponentFixture<IssueTrackerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssueTrackerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueTrackerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
