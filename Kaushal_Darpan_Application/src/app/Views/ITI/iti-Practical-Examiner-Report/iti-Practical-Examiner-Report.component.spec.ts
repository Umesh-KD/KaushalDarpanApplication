import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiPracticalExaminerReportComponent } from './iti-Practical-Examiner-Report.component';

describe('itiPracticalExaminerReportComponent', () => {
  let component: itiPracticalExaminerReportComponent;
  let fixture: ComponentFixture<itiPracticalExaminerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [itiPracticalExaminerReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiPracticalExaminerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
