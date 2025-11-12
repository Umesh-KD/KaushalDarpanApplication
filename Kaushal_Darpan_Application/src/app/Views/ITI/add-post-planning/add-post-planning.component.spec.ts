import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostPlanningComponent } from './add-post-planning.component';

describe('AddPostPlanningComponent', () => {
  let component: AddPostPlanningComponent;
  let fixture: ComponentFixture<AddPostPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPostPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
