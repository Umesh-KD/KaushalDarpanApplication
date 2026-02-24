import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerWithGroupCodeListComponent } from './examiner-with-group-code-list.component';

describe('StaticsReportProvideByExaminerComponent', () => {
  let component: ExaminerWithGroupCodeListComponent;
  let fixture: ComponentFixture<ExaminerWithGroupCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExaminerWithGroupCodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminerWithGroupCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
