import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerReportComponent } from './examiner-report.component';

describe('ExaminerReportComponent', () => {
  let component: ExaminerReportComponent;
  let fixture: ComponentFixture<ExaminerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExaminerReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
