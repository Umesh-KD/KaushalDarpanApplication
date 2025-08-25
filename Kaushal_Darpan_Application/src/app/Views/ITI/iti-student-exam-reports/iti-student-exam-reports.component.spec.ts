import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiStudentExamReportsComponent } from './iti-student-exam-reports.component';

describe('ItiStudentExamReportsComponent', () => {
  let component: ItiStudentExamReportsComponent;
  let fixture: ComponentFixture<ItiStudentExamReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiStudentExamReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiStudentExamReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
