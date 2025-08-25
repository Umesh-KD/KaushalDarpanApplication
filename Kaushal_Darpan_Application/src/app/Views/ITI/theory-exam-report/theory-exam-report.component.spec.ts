import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheoryExamReportComponent } from './theory-exam-report.component';

describe('TheoryExamReportComponent', () => {
  let component: TheoryExamReportComponent;
  let fixture: ComponentFixture<TheoryExamReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TheoryExamReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheoryExamReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
