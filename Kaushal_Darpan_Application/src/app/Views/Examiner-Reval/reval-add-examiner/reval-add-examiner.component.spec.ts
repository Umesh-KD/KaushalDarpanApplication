import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevalAddExaminerComponent } from './reval-add-examiner.component';

describe('AddExaminerComponent', () => {
  let component: RevalAddExaminerComponent;
  let fixture: ComponentFixture<RevalAddExaminerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevalAddExaminerComponent]
    });
    fixture = TestBed.createComponent(RevalAddExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
