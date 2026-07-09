import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksheetCorrectionHistoryReportComponent } from './marksheet-correction-history-report.component';

describe('MarksheetCorrectionHistoryReportComponent', () => {
  let component: MarksheetCorrectionHistoryReportComponent;
  let fixture: ComponentFixture<MarksheetCorrectionHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarksheetCorrectionHistoryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarksheetCorrectionHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
