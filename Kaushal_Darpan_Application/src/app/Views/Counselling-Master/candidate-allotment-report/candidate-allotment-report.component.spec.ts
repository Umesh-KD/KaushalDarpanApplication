import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAllotmentListReportComponent } from './candidate-allotment-report.component';

describe('CandidateAllotmentListReportComponent', () => {
  let component: CandidateAllotmentListReportComponent;
  let fixture: ComponentFixture<CandidateAllotmentListReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateAllotmentListReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateAllotmentListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
