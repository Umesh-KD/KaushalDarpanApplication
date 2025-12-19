import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPaperReportComponent } from './student-paper-report.component';

describe('StudentPaperReportComponent', () => {
  let component: StudentPaperReportComponent;
  let fixture: ComponentFixture<StudentPaperReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentPaperReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPaperReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
