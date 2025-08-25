import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreExamStudentComponent } from './pre-exam-student.component';

describe('PreExamStudentExaminationComponent', () => {
  let component: PreExamStudentComponent;
  let fixture: ComponentFixture<PreExamStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreExamStudentComponent]
    });
    fixture = TestBed.createComponent(PreExamStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
