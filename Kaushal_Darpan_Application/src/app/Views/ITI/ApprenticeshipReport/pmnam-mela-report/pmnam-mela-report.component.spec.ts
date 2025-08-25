import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmnamMelaReportComponent } from './pmnam-mela-report.component';

describe('PmnamMelaReportComponent', () => {
  let component: PmnamMelaReportComponent;
  let fixture: ComponentFixture<PmnamMelaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmnamMelaReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmnamMelaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
