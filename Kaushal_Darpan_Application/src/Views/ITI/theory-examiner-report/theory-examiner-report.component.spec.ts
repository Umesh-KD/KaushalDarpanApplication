import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheoryExaminerReportComponent } from './theory-examiner-report.component';

describe('TheoryExaminerReportComponent', () => {
  let component: TheoryExaminerReportComponent;
  let fixture: ComponentFixture<TheoryExaminerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TheoryExaminerReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheoryExaminerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
