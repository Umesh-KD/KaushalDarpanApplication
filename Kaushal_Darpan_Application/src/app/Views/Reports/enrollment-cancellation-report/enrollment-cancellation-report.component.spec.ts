import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentCancellationReportComponent } from './enrollment-cancellation-report.component';

describe('EnrollmentCancellationReportComponent', () => {
  let component: EnrollmentCancellationReportComponent;
  let fixture: ComponentFixture<EnrollmentCancellationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrollmentCancellationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentCancellationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
