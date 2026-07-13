import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllExaminerReportComponent } from './AllExaminerReport.component';

describe('AllExaminerReportComponent', () => {
  let component: AllExaminerReportComponent;
  let fixture: ComponentFixture<AllExaminerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllExaminerReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllExaminerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
