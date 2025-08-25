import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticsReportProvideByExaminerComponent } from './statics-report-provide-by-examiner.component';

describe('StaticsReportProvideByExaminerComponent', () => {
  let component: StaticsReportProvideByExaminerComponent;
  let fixture: ComponentFixture<StaticsReportProvideByExaminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticsReportProvideByExaminerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticsReportProvideByExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
