import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelievingPracticalExaminerComponent } from './relieving-practical-examiner.component';

describe('RelievingPracticalExaminerComponent', () => {
  let component: RelievingPracticalExaminerComponent;
  let fixture: ComponentFixture<RelievingPracticalExaminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelievingPracticalExaminerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelievingPracticalExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
