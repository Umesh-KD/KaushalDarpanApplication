import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineMarkingReportProvideByExaminerComponent } from './online-marking-report-provide-by-examiner.component';

describe('OnlineMarkingReportProvideByExaminerComponent', () => {
  let component: OnlineMarkingReportProvideByExaminerComponent;
  let fixture: ComponentFixture<OnlineMarkingReportProvideByExaminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlineMarkingReportProvideByExaminerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineMarkingReportProvideByExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
