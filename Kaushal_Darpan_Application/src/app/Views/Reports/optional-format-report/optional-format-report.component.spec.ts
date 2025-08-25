import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalFormatReportComponent } from './optional-format-report.component';

describe('OptionalFormatReportComponent', () => {
  let component: OptionalFormatReportComponent;
  let fixture: ComponentFixture<OptionalFormatReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionalFormatReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionalFormatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
