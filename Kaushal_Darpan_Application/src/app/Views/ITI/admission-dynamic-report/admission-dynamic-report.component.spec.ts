import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionDynamicReportComponent } from './admission-dynamic-report.component';

describe('AdmissionDynamicReportComponent', () => {
  let component: AdmissionDynamicReportComponent;
  let fixture: ComponentFixture<AdmissionDynamicReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmissionDynamicReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmissionDynamicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
