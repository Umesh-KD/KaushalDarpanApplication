import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPlanningDashboardITIComponent } from './post-planning-dashboard-iti.component';

describe('PostPlanningDashboardITIComponent', () => {
  let component: PostPlanningDashboardITIComponent;
  let fixture: ComponentFixture<PostPlanningDashboardITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPlanningDashboardITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPlanningDashboardITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
