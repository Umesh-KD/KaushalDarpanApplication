import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPlanningComponent } from './post-planning.component';

describe('PostPlanningComponent', () => {
  let component: PostPlanningComponent;
  let fixture: ComponentFixture<PostPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
