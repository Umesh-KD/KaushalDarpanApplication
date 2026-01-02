import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorAttandanceReportComponent } from './invigilator-attandance-report.component';

describe('InvigilatorAttandanceReportComponent', () => {
  let component: InvigilatorAttandanceReportComponent;
  let fixture: ComponentFixture<InvigilatorAttandanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvigilatorAttandanceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvigilatorAttandanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
