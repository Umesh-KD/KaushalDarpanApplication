import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentReportDownloadComponent } from './allotment-report-download.component';

describe('AllotmentReportDownloadComponent', () => {
  let component: AllotmentReportDownloadComponent;
  let fixture: ComponentFixture<AllotmentReportDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotmentReportDownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentReportDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
