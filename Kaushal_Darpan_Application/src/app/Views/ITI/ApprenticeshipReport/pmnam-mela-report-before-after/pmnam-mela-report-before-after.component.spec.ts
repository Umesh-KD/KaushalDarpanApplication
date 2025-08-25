import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PMNAMMelaReportBeforeAfterComponent } from './pmnam-mela-report-before-after.component';

describe('PMNAMMelaReportBeforeAfterComponent', () => {
  let component: PMNAMMelaReportBeforeAfterComponent;
  let fixture: ComponentFixture<PMNAMMelaReportBeforeAfterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PMNAMMelaReportBeforeAfterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PMNAMMelaReportBeforeAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
