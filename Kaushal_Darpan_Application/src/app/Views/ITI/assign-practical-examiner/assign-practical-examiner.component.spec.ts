import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPracticalExaminerComponent } from './assign-practical-examiner.component';

describe('AssignPracticalExaminerComponent', () => {
  let component: AssignPracticalExaminerComponent;
  let fixture: ComponentFixture<AssignPracticalExaminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignPracticalExaminerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPracticalExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
