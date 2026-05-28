import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IIPEventConsentReportComponent } from './iip-event-consent-report.component';

describe('IIPEventConsentReportComponent', () => {
  let component: IIPEventConsentReportComponent;
  let fixture: ComponentFixture<IIPEventConsentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IIPEventConsentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IIPEventConsentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
