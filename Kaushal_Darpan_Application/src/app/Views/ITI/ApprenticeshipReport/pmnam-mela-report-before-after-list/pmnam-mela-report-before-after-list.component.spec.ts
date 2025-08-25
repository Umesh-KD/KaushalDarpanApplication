import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PMNAMMelaReportBeforeAfterListComponent } from './pmnam-mela-report-before-after-list.component';

describe('PMNAMMelaReportBeforeAfterListComponent', () => {
  let component: PMNAMMelaReportBeforeAfterListComponent;
  let fixture: ComponentFixture<PMNAMMelaReportBeforeAfterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PMNAMMelaReportBeforeAfterListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PMNAMMelaReportBeforeAfterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
