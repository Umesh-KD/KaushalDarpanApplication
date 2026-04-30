import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterAttendencePercentReportComponent } from './bter-attendence-percent-report.component';

describe('BterAttendencePercentReportComponent', () => {
  let component: BterAttendencePercentReportComponent;
  let fixture: ComponentFixture<BterAttendencePercentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterAttendencePercentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterAttendencePercentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
